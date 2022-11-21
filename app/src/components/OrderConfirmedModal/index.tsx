import { StatusBar } from 'expo-status-bar';
import { Modal } from 'react-native';
import { CheckCircle } from '../Icons/CheckCircle';
import { Text } from '../Text';
import { Container, OkButton } from './styles';

export interface OrderConfirmedModalProps {
    visible: boolean;
    onClose: () => void;
}

export function OrderConfirmedModal({
    visible,
    onClose,
}: OrderConfirmedModalProps) {
    return (
        <Modal onRequestClose={onClose} animationType="fade" visible={visible}>
            <StatusBar style="light" />
            <Container>
                <CheckCircle />
                <Text weight="600" color="#fff">
                    Pedido confirmado
                </Text>
                <Text opacity={0.9} color="#fff">
                    O pedido já está na fila de produção
                </Text>
                <OkButton onPress={onClose}>
                    <Text weight="600" color="#D73035">
                        OK
                    </Text>
                </OkButton>
            </Container>
        </Modal>
    );
}
