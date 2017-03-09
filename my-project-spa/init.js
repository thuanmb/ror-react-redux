import { toastr } from 'react-redux-toastr';
import Humps from 'humps';

const setTokenInRequestHeader = (xhr, document) => {
  const tokenTag = document.querySelector('meta[name="csrf-token"]');
  if (tokenTag !== null) {
    const token = tokenTag.content;
    xhr.setRequestHeader('X-CSRF-Token', token);
  }
};

$(document).ajaxSend((event, xhr, ajaxOptions) => {
  if (['PUT', 'POST', 'DELETE'].indexOf(ajaxOptions.type) >= 0) {
    setTokenInRequestHeader(xhr, document);
  }
});

$(document).ajaxError((event, responses) => {
  try {
    const responseMessage = JSON.parse(responses.responseText).message;
    toastr.error(responses.statusText, responseMessage);
  } catch (e) {
    toastr.error(responses.statusText, responses.responseText);
  }
});

$.ajaxSetup({
  dataFilter(data) {
    return JSON.stringify(Humps.camelizeKeys(JSON.parse(data)));
  },
});
