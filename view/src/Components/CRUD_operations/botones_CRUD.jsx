import './botones_CRUD.css'
import PropTypes from 'prop-types';

export function ButtonAdd({text}){
  return (
    <button className='C-Button'>
        {text}
    </button>
  );
}

export function ButtonDelete({text}){
  return (
    <button className='D-Button'>
        {text}
    </button>
  );
}

export function ButtonUpdate({text}){
  return (
    <button className='U-Button'>
        {text}
    </button>
  );
}

ButtonAdd.propTypes = {
    text: PropTypes.string.isRequired
};
ButtonDelete.propTypes = {
    text: PropTypes.string.isRequired
};
ButtonUpdate.propTypes = {
    text: PropTypes.string.isRequired
};

