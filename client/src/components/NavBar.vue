<template>
  <div class="nav-container mb-3">
    <nav class="navbar navbar-expand-md navbar-light bg-light">
      <div class="container">
        <div class="navbar-brand logo" />
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon" />
        </button>

        <div
          id="navbarNav"
          class="collapse navbar-collapse"
        >
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <router-link
                to="/"
                class="nav-link"
              >
                Accueil
              </router-link>
            </li>
          </ul>
          <ul class="navbar-nav d-none d-md-block">
            <li
              v-if="!isAuthenticated"
              class="nav-item"
            >
              <button
                id="qsLoginBtn"
                class="btn btn-primary btn-margin"
                @click.prevent="login"
              >
                Se connecter
              </button>
            </li>

            <li
              v-if="isAuthenticated"
              class="nav-item dropdown"
            >
              <a
                id="profileDropDown"
                class="nav-link dropdown-toggle"
                href="#"
                data-toggle="dropdown"
              >
                <img
                  :src="profile.picture"
                  alt="User's profile picture"
                  class="nav-user-profile rounded-circle"
                  width="50"
                >
              </a>
              <div class="dropdown-menu dropdown-menu-right">
                <div class="dropdown-header">
                  {{ profile.name }}
                </div>
                <router-link
                  to="/profile"
                  class="dropdown-item dropdown-profile"
                >
                  <font-awesome-icon
                    class="mr-3"
                    icon="user"
                  />Mon compte
                </router-link>
                <a
                  id="qsLogoutBtn"
                  href="#"
                  class="dropdown-item"
                  @click.prevent="logout"
                >
                  <font-awesome-icon
                    class="mr-3"
                    icon="power-off"
                  />Se déconnecter
                </a>
              </div>
            </li>
          </ul>

          <ul
            v-if="!isAuthenticated"
            class="navbar-nav d-md-none"
          >
            <button
              class="btn btn-primary btn-block"
              @click="login"
            >
              Se connecter
            </button>
          </ul>

          <ul
            v-if="isAuthenticated"
            id="mobileAuthNavBar"
            class="navbar-nav d-md-none d-flex"
          >
            <li class="nav-item">
              <span class="user-info">
                <img
                  :src="profile.picture"
                  alt="User's profile picture"
                  class="nav-user-profile d-inline-block rounded-circle mr-3"
                  width="50"
                >
                <h6 class="d-inline-block">{{ profile.name }}</h6>
              </span>
            </li>
            <li>
              <font-awesome-icon
                icon="user"
                class="mr-3"
              />
              <router-link to="/profile">
                Profile
              </router-link>
            </li>

            <li>
              <font-awesome-icon
                icon="power-off"
                class="mr-3"
              />
              <a
                id="qsLogoutBtn"
                href="#"
                class
                @click.prevent="logout"
              >Log out</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  data () {
    return {
      isAuthenticated: false,
      profile: {}
    }
  },
  methods: {
    login () {
      this.$auth.login()
    },
    logout () {
      this.$auth.logOut()
      this.$router.push({ path: '/' })
    },
    handleLoginEvent (data) {
      this.isAuthenticated = data.loggedIn
      this.profile = data.profile
    }
  }
}
</script>

<style>
    #mobileAuthNavBar {
        min-height: 125px;
        justify-content: space-between;
    }
</style>
