import React from 'react';
import { authRoles } from 'app/auth';

const Message = React.lazy(() => import('./show/Message'));
const Messages = React.lazy(() => import('./list/Messages'));

const MessagesConfig = {
  settings: {
    layout: {
      config: {
        mode: 'fullwidth',
        scroll: 'content',
        navbar: {
          display: true,
          folded: false,
          position: 'left',
        },
        toolbar: {
          display: true,
          style: 'fixed',
          position: 'below',
        },
        footer: {
          display: false,
          style: 'fixed',
          position: 'below',
        },
      },
    },
  },
  auth: authRoles.admin,
  routes: [
    {
      path: '/messages/:id',
      element: <Message />,
    },
    {
      path: '/messages',
      exact: true,
      element: <Messages />,
    },
  ],
};

export default MessagesConfig;
