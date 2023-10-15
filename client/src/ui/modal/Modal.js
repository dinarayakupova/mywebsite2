import React from 'react';
import cls from './Modal.module.scss'
const Modal = ({children, visible, setVisible}) => {
	const rootClasses =[cls.modal]
	if(visible){
		rootClasses.push(cls.active)
	}
	return (
		<div className={rootClasses.join(' ')} onClick={()=>setVisible(false)}>
			<div className={cls.modalContent} onClick={(e)=>e.stopPropagation()}>
				{children}
			</div>
		</div>
	);
};

export default Modal;