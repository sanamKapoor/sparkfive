const EventBus = {
  Event: {
    SAVE_CROP_RELATED_FILE: "SAVE_CROP_RELATED_FILE",
    DESTROY_CROP_EVENT: "DESTROY_CROP_EVENT",
  },

  on(event: any, callback: any) {
    // eslint-disable-next-line no-undef
    document.addEventListener(event, (e) => callback(e.detail));
  },
  dispatch(event: any, data = {}) {
    // eslint-disable-next-line no-undef
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  remove(event: any, callback?: any) {
    // eslint-disable-next-line no-undef
    document.removeEventListener(event, callback);
  },
};

export default EventBus;
