<template>
  <div class="container">
    <div class="row align-items-center profile-header">
      <div class="col-md-2 mb-3">
        <img
          :src="profile.picture"
          alt="User's profile picture"
          class="rounded-circle img-fluid profile-picture"
        >
      </div>
      <div class="col-md text-center text-md-left">
        <h2>{{ profile.name }}</h2>
        <p class="lead text-muted">
          {{ profile.email }}
        </p>
      </div>
    </div>

    <div class="row">
      <pre
        v-highlightjs="JSON.stringify(profile, null, 2)"
        class="rounded w-100"
      ><code class="json" /></pre>
    </div>
    <p>id token: {{ $auth.idToken }}</p>
    <p>access_token: {{ $auth.accessToken }}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      profile: this.$auth.profile
    }
  },
  methods: {
    handleLoginEvent (data) {
      this.profile = data.profile
    }
  }
}
</script>
