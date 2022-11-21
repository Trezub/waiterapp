import { useState } from 'react';
import { Modal, TouchableOpacity, Platform } from 'react-native';
import { Button } from '../Button';
import { Close } from '../Icons/Close';
import { Text } from '../Text';
import { Form, ModalBody, Overlay, Header, Input } from './styles';

export interface TableModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (table: string) => void;
}

export function TableModal({ visible, onClose, onSave }: TableModalProps) {
    const [tableNumber, setTableNumber] = useState('');

    function handleSave() {
        onSave(tableNumber);
        onClose();
        setTableNumber('');
    }

    return (
        <Modal animationType="fade" transparent visible={visible}>
            <Overlay
                behavior={Platform.OS === 'android' ? 'height' : 'padding'}
            >
                <ModalBody>
                    <Header>
                        <Text weight="600">Informe a mesa</Text>

                        <TouchableOpacity onPress={onClose}>
                            <Close color="#666" />
                        </TouchableOpacity>
                    </Header>
                    <Form>
                        <Input
                            keyboardType="number-pad"
                            placeholder="Número da mesa"
                            placeholderTextColor="#666"
                            onChangeText={setTableNumber}
                        />
                        <Button
                            onPress={handleSave}
                            disabled={tableNumber.length === 0}
                        >
                            Salvar
                        </Button>
                    </Form>
                </ModalBody>
            </Overlay>
        </Modal>
    );
}
