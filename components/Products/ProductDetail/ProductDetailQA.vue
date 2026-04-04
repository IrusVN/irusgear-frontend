<template>
  <section class="detail-card p-3 p-lg-4">
    <div class="section-head mb-3">
      <h2>Hỏi và đáp</h2>
    </div>

    <div class="ask-box">
      <div>
        <p class="ask-title">Hãy đặt câu hỏi cho chúng tôi</p>
        <p class="ask-copy">
          Tư vấn viên sẽ phản hồi trong vòng 1 giờ. Nếu bạn gửi sau 22h, hệ thống sẽ trả
          lời vào sáng hôm sau.
        </p>
      </div>
      <div class="ask-form">
        <textarea rows="4" placeholder="Viết câu hỏi của bạn tại đây"></textarea>
        <button type="button">Gửi câu hỏi</button>
      </div>
    </div>

    <div class="qa-list">
      <article v-for="item in questions" :key="`${item.author}-${item.time}`" class="qa-item">
        <div class="qa-author">
          <div class="avatar">{{ item.author.charAt(0) }}</div>
          <div>
            <h3>{{ item.author }}</h3>
            <p>{{ item.time }}</p>
          </div>
        </div>
        <p class="question">{{ item.question }}</p>

        <div class="answer-box">
          <div class="admin-badge">QTV</div>
          <div>
            <h4>Quản trị viên</h4>
            <p>{{ item.answer }}</p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
defineProps({
  questions: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.detail-card {
  background: #fff;
  border: 1px solid #e5edf7;
  border-radius: 16px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
}

.section-head h2 {
  font-size: 1.05rem;
  font-weight: 800;
  margin: 0;
  color: #111827;
}

.ask-box {
  border: 1px solid #e2ebf6;
  background: linear-gradient(180deg, #f8fbff 0%, #fff 100%);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.ask-title {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
}

.ask-copy {
  color: #64748b;
  margin-bottom: 0.85rem;
}

.ask-form {
  display: grid;
  gap: 0.75rem;
}

.ask-form textarea {
  width: 100%;
  border: 1px solid #dce9f9;
  border-radius: 12px;
  padding: 0.95rem 1rem;
  resize: vertical;
}

.ask-form button {
  justify-self: start;
  border: 0;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #fff;
  border-radius: 999px;
  padding: 0.75rem 1.15rem;
  font-weight: 700;
}

.qa-list {
  display: grid;
  gap: 1rem;
}

.qa-item {
  border: 1px solid #e2ebf6;
  border-radius: 12px;
  padding: 1rem;
}

.qa-author {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  margin-bottom: 0.8rem;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #dbeafe;
  color: #1d4ed8;
  display: grid;
  place-items: center;
  font-weight: 800;
}

.qa-author h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
}

.qa-author p {
  margin: 0.15rem 0 0;
  color: #94a3b8;
  font-size: 0.9rem;
}

.question {
  color: #334155;
  line-height: 1.65;
  margin-bottom: 0.9rem;
}

.answer-box {
  display: flex;
  gap: 0.8rem;
  padding: 0.9rem;
  border-radius: 12px;
  background: #f8fbff;
  border: 1px solid #dce9f9;
}

.admin-badge {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #ed8a95 0%, #c40016 100%);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 800;
  flex-shrink: 0;
}

.answer-box h4 {
  margin: 0 0 0.25rem;
  font-size: 0.98rem;
  font-weight: 800;
  color: #111827;
}

.answer-box p {
  margin: 0;
  color: #475569;
  line-height: 1.6;
}
</style>
