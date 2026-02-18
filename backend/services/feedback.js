export async function handleFeedbackSubmission(user, requestData, env) {
  try {
    const { category, content } = requestData;

    if (!category || !content) {
      return { success: false, error: "缺少必要参数：category 和 content" };
    }

    if (content.length > 1000) {
      return { success: false, error: "反馈内容不能超过1000字符" };
    }

    const sanitizedContent = content.replace(/<[^>]*>/g, "").trim();
    if (!sanitizedContent) {
      return { success: false, error: "反馈内容不能为空" };
    }

    const rateLimitKey = `feedback_rate_limit:${user.id}`;
    const lastSubmission = await env.FEEDBACK.get(rateLimitKey);
    const now = Date.now();
    if (lastSubmission) {
      const timeDiff = now - parseInt(lastSubmission, 10);
      if (timeDiff < 10 * 60 * 1000) {
        const remainingTime = Math.ceil((10 * 60 * 1000 - timeDiff) / 60000);
        return { success: false, error: `请等待${remainingTime}分钟后再提交反馈` };
      }
    }

    const feedbackId = `feedback_${user.id}_${now}`;
    const feedback = {
      id: feedbackId,
      userId: user.id,
      email: user.email,
      category,
      content: sanitizedContent,
      created_at: new Date().toISOString(),
      status: "pending",
    };

    await env.FEEDBACK.put(feedbackId, JSON.stringify(feedback));

    const userFeedbackKey = `user_feedback:${user.id}`;
    const existingList = await env.FEEDBACK.get(userFeedbackKey);
    const feedbackList = existingList ? JSON.parse(existingList) : [];
    feedbackList.unshift(feedbackId);
    if (feedbackList.length > 20) {
      feedbackList.splice(20);
    }
    await env.FEEDBACK.put(userFeedbackKey, JSON.stringify(feedbackList));

    await env.FEEDBACK.put(rateLimitKey, now.toString(), { expirationTtl: 600 });

    return {
      success: true,
      message: "反馈提交成功，感谢您的建议！",
      feedbackId,
    };
  } catch (error) {
    console.error("处理反馈提交时出错:", error);
    return { success: false, error: "提交失败，请稍后重试" };
  }
}

export async function getUserFeedbackList(user, env) {
  try {
    const userFeedbackKey = `user_feedback:${user.id}`;
    const feedbackListStr = await env.FEEDBACK.get(userFeedbackKey);
    if (!feedbackListStr) {
      return {
        success: true,
        feedbacks: [],
        count: 0,
      };
    }

    const feedbackIds = JSON.parse(feedbackListStr);

    const results = await Promise.allSettled(feedbackIds.map((id) => env.FEEDBACK.get(id)));

    const feedbacks = [];
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      if (r.status === "fulfilled" && r.value) {
        try {
          const feedback = JSON.parse(r.value);
          feedbacks.push({
            id: feedback.id,
            category: feedback.category,
            content: feedback.content,
            created_at: feedback.created_at,
            status: feedback.status || "pending",
          });
        } catch (e) {
          console.error(`解析反馈失败: ${feedbackIds[i]}`, e);
        }
      }
    }

    return {
      success: true,
      feedbacks,
      count: feedbacks.length,
    };
  } catch (error) {
    console.error("获取用户反馈列表时出错:", error);
    return { success: false, error: "获取反馈列表失败" };
  }
}

export async function getAllFeedbackForAdmin(env, { page = 1, pageSize = 50 } = {}) {
  try {
    const allKeys = await env.FEEDBACK.list({ prefix: "feedback_" });

    const results = await Promise.allSettled(allKeys.keys.map((key) => env.FEEDBACK.get(key.name)));

    const allFeedback = [];
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) {
        try {
          allFeedback.push(JSON.parse(r.value));
        } catch (_) {}
      }
    }

    allFeedback.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const todayStr = new Date().toISOString().split("T")[0];
    const stats = {
      total: allFeedback.length,
      pending: allFeedback.filter((f) => f.status === "pending").length,
      processed: allFeedback.filter((f) => f.status === "processed").length,
      today: allFeedback.filter((f) => {
        const feedbackDate = new Date(f.created_at).toISOString().split("T")[0];
        return feedbackDate === todayStr;
      }).length,
    };

    const start = (page - 1) * pageSize;
    const paginatedFeedback = allFeedback.slice(start, start + pageSize);

    return {
      success: true,
      feedbacks: paginatedFeedback,
      stats,
      count: allFeedback.length,
      page,
      pageSize,
      totalPages: Math.ceil(allFeedback.length / pageSize),
    };
  } catch (error) {
    console.error("管理员获取反馈列表时出错:", error);
    return { success: false, error: "获取反馈列表失败" };
  }
}
