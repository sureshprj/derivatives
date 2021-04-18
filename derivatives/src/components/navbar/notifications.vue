<template>
  <div class="d-flex align-center mx-3">
    <v-menu
      offset-y
      :close-on-content-click="false"
      min-width="220"
      max-width="220"
    >
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on: tooltip }">
            <svg
              width="22"
              height="25"
              viewBox="0 0 22 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              v-bind="attrs"
              v-on="{ ...tooltip, ...menu }"
            >
              <path
                d="M19.0919 18.3192L18.0898 17.6512V11.8516C18.0898 8.15947 15.2529 5.11806 11.6445 4.79132V3.64453C11.6445 3.28858 11.356 3 11 3C10.644 3 10.3555 3.28858 10.3555 3.64453V4.79132C6.74708 5.11806 3.91016 8.15947 3.91016 11.8516V17.6512L2.90813 18.3192C2.72877 18.4388 2.62109 18.6399 2.62109 18.8555V21.4336C2.62109 21.7895 2.90967 22.0781 3.26562 22.0781H7.51416C7.8167 23.7379 9.26411 25 11 25C12.7359 25 14.1833 23.7379 14.4858 22.0781H18.7344C19.0903 22.0781 19.3789 21.7895 19.3789 21.4336V18.8555C19.3789 18.6399 19.2712 18.4387 19.0919 18.3192ZM11 23.7109C9.97782 23.7109 9.11217 23.0209 8.83614 22.0781H13.1639C12.8878 23.0209 12.0222 23.7109 11 23.7109ZM18.0898 20.7891C17.4917 20.7891 4.61424 20.7891 3.91016 20.7891V19.2004L4.91219 18.5323C5.0915 18.4128 5.19922 18.2116 5.19922 17.9961V11.8516C5.19922 8.65301 7.80145 6.05078 11 6.05078C14.1986 6.05078 16.8008 8.65301 16.8008 11.8516V17.9961C16.8008 18.2116 16.9085 18.4128 17.0878 18.5323L18.0898 19.2004V20.7891Z"
                fill="white"
              />
              <circle
                v-if="!notificationsCleaned"
                cx="13"
                cy="6"
                r="5"
                fill="#1262FF"
                stroke="#242837"
                stroke-width="2"
              />
            </svg>
          </template>
          <span>Notifications</span>
        </v-tooltip>
      </template>
      <v-card>
        <v-card-title class="dialog-title dialogBackLight pa-2 px-4"
          >Recent Notifications</v-card-title
        >
        <v-list v-if="notifications.length > 0" class="pa-0">
          <v-list-item-group>
            <v-list-item
              v-for="(item, index) in notifications"
              :key="index"
              class="dialogBackDark pa-3 px-4 notification-item"
            >
              <!--               <div class="text-end">
                {{ item.timestamp }}
              </div> -->
              <div class="d-flex align-center">
                <svg
                  v-if="item.status == 'success'"
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.00005 12.8C11.9765 12.8 15.2 10.4719 15.2 7.60001C15.2 4.72813 11.9765 2.40001 8.00005 2.40001C4.0236 2.40001 0.800049 4.72813 0.800049 7.60001C0.800049 10.4719 4.0236 12.8 8.00005 12.8Z"
                    fill="black"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0 8C0 3.584 3.584 0 8 0C12.416 0 16 3.584 16 8C16 12.416 12.416 16 8 16C3.584 16 0 12.416 0 8ZM2.39998 7.99998L6.39998 12L13.6 4.79998L12.472 3.66398L6.39998 9.73598L3.52798 6.87198L2.39998 7.99998Z"
                    fill="#2ECC71"
                  />
                </svg>

                <svg
                  v-else
                  width="24"
                  height="24"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.00005 12.8C11.9765 12.8 15.2 10.4719 15.2 7.6C15.2 4.72812 11.9765 2.4 8.00005 2.4C4.0236 2.4 0.800049 4.72812 0.800049 7.6C0.800049 10.4719 4.0236 12.8 8.00005 12.8Z"
                    fill="black"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0 8C0 3.576 3.576 0 8 0C12.424 0 16 3.576 16 8C16 12.424 12.424 16 8 16C3.576 16 0 12.424 0 8ZM10.872 12L12 10.872L9.128 8L12 5.128L10.872 4L8 6.872L5.128 4L4 5.128L6.872 8L4 10.872L5.128 12L8 9.128L10.872 12Z"
                    fill="#FF5D52"
                  />
                </svg>

                <span class="ml-3 mt-1">{{ item.text }}</span>
              </div>
            </v-list-item>
          </v-list-item-group>
        </v-list>

        <div v-else class="dialogBackDark pa-4 text-center">
          <p class="mb-0">No notifications</p>
        </div>

        <div
          v-if="notifications.length > 0"
          style="cursor: pointer;"
          @click="cleanNotifications()"
          class="dialogBackLight pa-2 px-4 text-center clean-notifications-button"
        >
          Clear all notifications
        </div>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: ["notifications"],
  data() {
    return {
      notificationsCleaned: false
    };
  },
  methods: {
    cleanNotifications() {
      this.notifications = true;
      this.notificationsCleaned = true;
    }
  }
};
</script>

<style scoped>
.notification-item {
  font-size: 12px;
}
.clean-notifications-button {
  font-size: 14px;
  color: var(--v-primary-base);
  font-weight: 400;
}
</style>
