import React from "react";
import { confirmAlert, ReactConfirmAlertProps } from 'react-confirm-alert';
import { Modal } from '../types';

export default class ModalComponent extends React.Component<Modal, any> {
    constructor(props: Modal) {
        super(props);
    };

    componentDidMount() {
        this.RenderModal(); 
    };

    componentDidUpdate() {
        this.RenderModal(); 
    };

    RenderModal = () => {
        let modalButtoms : Array<{
          label: string;
          onClick: () => void;
          className?: string;
        }> = [
          {
            label: (this.props.buttonOK && this.props.buttonOK.label) ? this.props.buttonOK.label : 'Ok',
            onClick: (this.props.buttonOK && this.props.buttonOK.onClick) ? this.props.buttonOK.onClick : () => {return true;}
          }
        ];
        let modalProps : ReactConfirmAlertProps = {
          title :this.props.tittle,
          message: this.props.message,
          buttons: modalButtoms,
          closeOnEscape: false,
          closeOnClickOutside: true,
          overlayClassName: 'unselectable'
        };
        confirmAlert(modalProps);
    };

    render() {
        return (<div></div>);
    };
}