import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FusePageCarded from '@fuse/core/FusePageCarded';

import TableComponent from 'app/fuse-layouts/shared-components/table/Table';
import PageCardedHeader from 'app/fuse-layouts/shared-components/page-carded-header/PageCardedHeader';

import { getAll, selectAll } from '../store/messagesSlice';
import { setOne } from '../store/messageSlice';

const columns = [
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: '#',
    sort: true,
  },
  {
    id: 'title',
    align: 'left',
    disablePadding: false,
    label: 'Titulo',
    sort: false,
  },
  {
    id: 'detail',
    align: 'left',
    disablePadding: false,
    label: 'Descrição',
    sort: false,
  },
];

export default function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messagesRedux = useSelector(selectAll);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleClick(value) {
    navigate(`/messages/${value.uid}`);
    dispatch(setOne({ uid: value.uid, title: value.title, detail: value.detail }));
  }

  function handleClickNew() {
    navigate(`/messages/new`);
  }

  useEffect(() => {
    setLoading(true);
    dispatch(getAll());
  }, []);

  useEffect(() => {
    if (messagesRedux) {
      setLoading(false);
      setData(messagesRedux);
    }
  }, [messagesRedux]);

  return (
    <FusePageCarded
      classes={{
        content: 'flex',
        contentCard: 'overflow-hidden rounded-t-12',
        header: 'min-h-72 h-72 sm:h-136 sm:min-h-136 white',
      }}
      header={
        <PageCardedHeader title="Mensagens" buttonTitle="NOVO" buttonAction={handleClickNew} />
      }
      content={<TableComponent columns={columns} data={data} action={handleClick} />}
      innerScroll
    />
  );
}
