import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
/* eslint-disable camelcase */

class Api extends FuseUtils.EventEmitter {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.setBaseUrl();
    this.setInterceptors();
    this.handleAuthentication();
  }

  setBaseUrl = () => {
    // axios.defaults.baseURL = process.env.REACT_APP_API_URL;
    axios.defaults.baseURL = 'https://recados-api-thobiassilva.herokuapp.com';
    axios.defaults.headers.common.Authorization = '00bf9a6c-d0b3-42db-aa38-bcc24bdc22a9';
  };

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (err.response?.status === 401 && err.config && !err.config.__isRetryRequest) {
            // if you ever get an unauthorized response, logout the user
            this.emit('onAutoLogout', err.response?.data?.message);
            this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();

    if (!access_token) {
      this.emit('onNoAccessToken');

      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit('onAutoLogin', true);
    } else {
      this.setSession(null);
      this.emit('onAutoLogout', 'access_token expired');
    }
  };

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      axios.post('/register', data).then((response) => {
        if (response.data.data) {
          this.setSession(response.data.access_token);
          resolve({
            uid: response.data.data,
          });
        } else {
          reject(response.data.error);
        }
      });
    });
  };

  doGet = async (url) => {
    try {
      // this.init();
      const response = await axios.get(url);

      if (response.data.success === true) {
        return response.data;
      }

      return 'ERRO';
    } catch (error) {
      return error.response;
    }
  };

  doPost = async (url, data) => {
    try {
      const response = await axios.post(url, data);

      if (response.data.success === true) {
        return response.data;
      }

      return 'erro';
    } catch (error) {
      return { data: error.response.data, status: error.response.status };
    }
  };

  doPut = async (url, data) => {
    try {
      const response = await axios.put(url, data);

      if (response.data.success === true) {
        return response.data;
      }

      return 'erro';
    } catch (error) {
      return { data: error.response.data, status: error.response.status };
    }
  };

  doFile = async (url, data) => {
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success === true) {
        return response.data;
      }

      return 'erro';
    } catch (error) {
      return { data: error.response.data, status: error.response.status };
    }
  };

  doDelete = async (url) => {
    try {
      const response = await axios.delete(url);

      if (response.data.success === true) {
        return response.data;
      }

      return 'erro';
    } catch (error) {
      return error.response;
    }
  };

  signInWithEmailAndPassword = (username, password, remember) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/login', {
          login: username,
          password,
        })
        .then((response) => {
          if (response.data.data) {
            if (remember) {
              this.setSaveSession(response.data.data);
            } else {
              this.setSession(response.data.data);
            }
            resolve({
              uid: response.data.data,
              role: ['admin'],
              data: {
                displayName: username,
                email: username,
                photoURL: `https://api.multiavatar.com/${username}.png`,
              },
            });
          } else {
            reject(response.data.error);
          }
        });
    });
  };

  signUpWithEmailAndPassword = (username, password) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/register', {
          login: username,
          password,
        })
        .then((response) => {
          if (response.data.data) {
            this.setSession(response.data.data);

            resolve({
              uid: response.data.data,
              role: ['admin'],
              data: {
                displayName: username,
                email: username,
                photoURL: `https://api.multiavatar.com/${username}.png`,
              },
            });
          } else {
            reject(response.data.error);
          }
        });
    });
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      const token = this.getAccessToken();
      axios
        .post('/login/token', { token })
        .then((response) => {
          if (response.data.data.user) {
            this.setSession(response.data.data.access_token);
            resolve(response.data.data.user);
          } else {
            this.logout();
            reject(new Error('Falha ao tentar logar com o token.'));
          }
        })
        .catch((error) => {
          this.logout();
          reject(new Error('Falha ao tentar logar com o token.'));
        });
    });
  };

  updateUserData = (user) => {
    return axios.put(`/users/${user.uid}`, {
      user,
    });
  };

  setSession = (access_token) => {
    if (access_token) {
      // sessionStorage.setItem('jwt_access_token', access_token);
      axios.defaults.headers.common.Authorization = `${access_token}`;
    } else {
      // sessionStorage.removeItem('jwt_access_token');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  setSaveSession = (access_token) => {
    if (access_token) {
      // localStorage.setItem('jwt_access_token', access_token);
      axios.defaults.headers.common.Authorization = `${access_token}`;
    } else {
      // localStorage.removeItem('jwt_access_token');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null);
    this.setSaveSession(null);
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    const decoded = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn('access token expired');
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    let token = window.sessionStorage.getItem('jwt_access_token');
    if (!token) {
      token = window.localStorage.getItem('jwt_access_token');
    }

    return token;
  };
}

const instance = new Api();

export default instance;
