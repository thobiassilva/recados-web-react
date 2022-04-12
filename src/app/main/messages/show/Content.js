import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Formsy from 'formsy-react';
import { TextFieldFormsy } from '@fuse/core/formsy';
import FuseLoading from '@fuse/core/FuseLoading';
import { useDeepCompareEffect } from '@fuse/hooks';

import objectsKeysEquals from 'app/utils/validations/objectsKeysEquals';
import ButtonDefault from 'app/fuse-layouts/shared-components/button-default/ButtonDeafault';
import { Grid } from '@mui/material';

import { showMessage } from 'app/store/fuse/messageSlice';
import ButtonPrimary from 'app/fuse-layouts/shared-components/button-primary/ButtonPrimary';
import {
  saveOne,
  newData,
  updateOne,
  updateResponse,
  updateLoading,
  deleteOne,
} from '../store/messageSlice';

function Content() {
  const dispatch = useDispatch();
  const routeParams = useParams();
  const navigate = useNavigate();
  const messageRedux = useSelector(({ message }) => message);
  const messagesRedux = useSelector(({ messages }) => messages);

  const [contents, setContents] = useState([]);
  const [selectedContents, setSelectedContents] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useDeepCompareEffect(() => {
    function updateState() {
      const { id } = routeParams;
      if (id === 'new') {
        dispatch(newData());
      }
    }

    updateState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (messageRedux) {
      if (loading) {
        setLoading(messageRedux.loading);
      }
    }
  }, [messageRedux]);

  useEffect(() => {
    function clear() {
      const { id } = routeParams;
      setIsFormValid(false);

      if (id === 'new') {
        dispatch(newData());
        navigate('/messages/new');
      } else {
        dispatch(updateResponse({ message: '', success: false }));
      }
    }

    if (messageRedux?.error) {
      dispatch(
        showMessage({
          message: 'Deu erro.',
          autoHideDuration: 6000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      );

      clear();
    }

    if (messageRedux?.success) {
      navigate('/messages');
    }
  }, [messageRedux.success]);

  function canBeSubmitted(modal) {
    if (modal) {
      let diff = false;

      if (modal === true) {
        diff = isFormValid;
      } else {
        diff = objectsKeysEquals(modal, messageRedux);
      }
      const diffContents = messageRedux?.contents?.length !== selectedContents.length;

      if ((diff || diffContents) && !isFormValid) {
        setIsFormValid(true);
      }

      if (!diff && !diffContents && isFormValid) {
        setIsFormValid(false);
      }

      if ((diff && !diffContents) || (!diff && diffContents && !isFormValid)) {
        setIsFormValid(true);
      }
    }
  }

  function handleSubmit(modal) {
    setLoading(true);
    dispatch(updateLoading(true));

    if (messageRedux?.uid) {
      dispatch(updateOne({ data: modal, uid: messageRedux?.uid }));
    } else {
      dispatch(saveOne(modal));
    }
  }

  function handleDelete() {
    setLoading(true);
    dispatch(updateLoading(true));
    dispatch(deleteOne({ uid: messageRedux?.uid }));
  }

  function handleSelect(value) {
    setSelectedContents(value);
  }
  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  if (!messageRedux?.id && loading) {
    return <FuseLoading />;
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Formsy
          onValidSubmit={handleSubmit}
          onChange={canBeSubmitted}
          onValid={enableButton}
          onInvalid={disableButton}
        >
          <TextFieldFormsy
            className="mb-16 w-full"
            label="Titulo"
            type="text"
            name="title"
            value={messageRedux.title}
            variant="outlined"
            validations={{ minLength: 3 }}
            validationErrors={{ minLength: 'Preencha o campo com o Titulo' }}
            fullWidth
            autoFocus
            required
          />
          <TextFieldFormsy
            className="mb-16 w-full"
            label="Descrição"
            type="text"
            name="detail"
            value={messageRedux.detail}
            variant="outlined"
            validations={{ minLength: 3 }}
            validationErrors={{ minLength: 'Preencha o campo com a descrição' }}
            fullWidth
            required
          />

          {/* <SelectFormsy
						className="mb-16 w-full"
						label="Recorrência"
						type="select"
						name="payment"
						value={plan.payment}
						variant="outlined"
						fullWidth
					>
						<MenuItem value="" disabled>
							Escolha a recorrência
						</MenuItem>
						{recurrences.map(item => (
							<MenuItem value={item.value}>{item.label}</MenuItem>
						))}
					</SelectFormsy> */}

          <Grid container item className="flex justify-end items-end">
            <Grid item xs={7} sm={5} md={4} lg={3} xl={2}>
              <ButtonDefault
                fullWidth
                type="submit"
                title="Salvar"
                loading={loading}
                disabled={!isFormValid}
              />
              {messageRedux.uid && (
                <ButtonPrimary
                  color="primary"
                  onClick={() => handleDelete()}
                  fullWidth
                  type="button"
                  title="Deletar"
                  loading={loading}
                  disabled={!isFormValid}
                />
              )}
            </Grid>
          </Grid>
        </Formsy>
      </Grid>
    </Grid>
  );
}

export default Content;
