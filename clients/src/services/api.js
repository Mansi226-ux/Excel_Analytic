

const BASE_URL = "http://localhost:3000";

 const api = {
  //user APIs
  register: `${BASE_URL}/user/register`,
  login: `${BASE_URL}/user/login`,
  forget_password: `${BASE_URL}/user/forgot-password`,
  create_new_password: `${BASE_URL}/user/create-new-password`,
  upload: `${BASE_URL}/upload/file`,
  chart_save: `${BASE_URL}/charts/save`,
  uploaded_history: `${BASE_URL}/upload/upload-history`,
  chart_history: `${BASE_URL}/charts/history`,
  chart_delete: `${BASE_URL}/charts/delete/:id`,

  // Admin APIs
  all_users: `${BASE_URL}/admin/all-users`,
  all_files: `${BASE_URL}/admin/all-files`,
  all_charts: `${BASE_URL}/admin/all-charts`,
  all_insights: `${BASE_URL}/admin/all-insights`,
  user_files: `${BASE_URL}/admin/files/user/:id`,
  user_charts:`${BASE_URL}/admin/charts/user/:id`,
  
  // unused APIs
  record_id: `${BASE_URL}/upload/record/:id`,
  delete_id: `${BASE_URL}/upload/delete/:id`,
 
};

export default api;