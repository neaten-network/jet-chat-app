<template>
  <div class="message-container" :class="sender ? 'current-user' : ''">
    <div class="profile-image">
      <img v-if="photoURL" :src="photoURL" class="user-avatar" />
    </div>
    <div class="message">
      <span class="created-at">{{ createdAt }}</span>
      <span class="display-name" v-if="!sender">{{ name }}:</span>
      <span class="chat-message">{{ message }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: { type: String, default: "" },
    photoURL: { type: String, default: null },
    message: { type: String, default: "" },
    createdAt: { type: String, default: "" },
    sender: { type: Boolean, default: false },
  },
  setup(props) {
    return { props };
  },
};
</script>

<style>
.message-container {
  padding: 0 2rem;
  display: flex;
  align-items: center;
}
.message {
  display: inline-block;
  max-width: 600px;
  margin: 0.5rem 1rem;
  padding: 1rem 2rem;
  background: #23395d;
  border-radius: 1.5rem 1.5rem 1.5rem 0;
}
.message-container.current-user {
  flex-direction: row-reverse;
}
.message-container.current-user .message {
  background: #004dfc;
  border-radius: 1.5rem 1.5rem 0 1.5rem;
}
.message-container.current-user .profile-image {
  background: url("../assets/images/default-img.jpeg") no-repeat center
    center/cover;
}
.message-container .profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: url("../assets/images/default-img-2.jpg") no-repeat center
    center/cover;
}
.message-container .user-avatar {
  background-size: cover;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.message .created-at {
  display: block;
  color: #ddd;
  font-size: 1.2rem;
  margin-bottom: 0.4rem;
}
.message .display-name {
  font-weight: bold;
  margin-right: 0.6rem;
  color: #fff;
}
.message .chat-message {
  color: #fff;
}
@media (max-width: 1050px) {
  .message {
    max-width: 500px;
  }
}
@media (max-width: 960px) {
  .message {
    max-width: 300px;
  }
}
@media (max-width: 768px) {
  .message {
    max-width: 400px;
  }
}
@media (max-width: 550px) {
  .message {
    max-width: 300px;
  }
}
@media (max-width: 435px) {
  .message {
    max-width: 250px;
  }
}
@media (max-width: 375px) {
  .message {
    max-width: 220px;
  }
}
@media (max-width: 325px) {
  .message {
    max-width: 180px;
  }
}
</style>
