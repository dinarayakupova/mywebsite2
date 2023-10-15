import cls from './CartModal.module.scss'
const CartModal = ({children, visible, setVisible}) => {
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

export default CartModal;