import { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import PageCardedHeader from 'app/fuse-layouts/shared-components/page-carded-header/PageCardedHeader';

function Header() {
  const messageRedux = useSelector(({ message }) => message);
  const [message, setProduct] = useState({});

  useEffect(() => {
    if (messageRedux) {
      setProduct(messageRedux);
    }
  }, [messageRedux]);

  return (
    <PageCardedHeader
      link="/messages"
      title={message?.title || 'Nova Mensagem'}
      textBack="Messages"
    />
  );
}

export default Header;
