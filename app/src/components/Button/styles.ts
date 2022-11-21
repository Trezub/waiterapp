import styled from "styled-components/native";

export const Container = styled.TouchableOpacity`
    background: ${({disabled}) => disabled ? '#999' : '#D73835'};
    border-radius: 12px;
    padding: 14px 24px;
    align-items: center;
    justify-content: center;
`;
