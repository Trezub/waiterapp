import styled from 'styled-components';

export const Overlay = styled.div<{isVisible: boolean}>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;

    transition: background-color 200ms ease-out, backdrop-filter 200ms ease-out;
    background: rgba(0, 0, 0, ${({isVisible}) => isVisible ? 0.6 : 0});
    backdrop-filter: blur(${({ isVisible }) => isVisible ? '4.5px' : '0px'});
    pointer-events: ${({isVisible}) =>  isVisible ? 'unset' : 'none'};

    display: grid;
    place-items: center;
`;

export const ModalBody = styled.div`
    background: #fff;
    width: 480px;
    border-radius: 8px;
    padding: 32px;

    header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        strong {
            font-size: 24px;
        }

        button {
            border: none;
            background-color: transparent;
            line-height: 0;
        }
    }

    .status-container {
        margin-top: 32px;

        small {
            font-size: 14px;
            opacity: 0.8;
        }

        div {
            display: flex;
            gap: 8px;
            align-items: center;
        }
    }
`;

export const OrderDetails = styled.div`
    margin-top: 32px;

    > strong {
        font-weight: 500;
        font-size: 14px;
        opacity: 0.8;
    }

    .order-items {
        margin-top: 16px;

        .item {
            display: flex;

            & + .item {
                margin-top: 16px;
            }

            .quantity {
                margin-left: 12px;
                font-size: 14px;
                display: block;
                min-width: 20px;
            }

            .product-details {
                margin-left: 4px;
                strong {
                    display: block;
                    margin-bottom: 4px;
                }

                span {
                    font-size: 14px;
                    color: #666;
                }
            }
        }
    }

    .total {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 25px;

        > span {
            font-size: 14px;
            font-weight: 500;
            opacity: 0.8;
        }
    }
`;

export interface ImageProps {
    src: string;
}

export const Image = styled.div<ImageProps>`
    background-image: url(${({ src }) => src});
    background-size: cover;
    background-repeat: no-repeat;
    width: 65px;
    border-radius: 6px;
    background-position: center;
`;

export const Actions = styled.footer`
    display: flex;
    flex-direction: column;

    .primary {
        margin-top: 32px;
        background: #333;
        border-radius: 12px;
        border: none;
        color: #fff;
        padding: 12px 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        transition: background-color 100ms ease-out, filter 100ms ease-out;
        :hover:enabled {
            background: #444;
        }

        :active, :disabled {
            filter: brightness(80%);
        }

        :disabled {
            cursor: not-allowed;
        }
    }

    .secondary {
        margin-top: 8px;
        padding: 14px 24px;
        color: #D73035;
        font-weight: bold;
        border: none;
        background: transparent;

        transition: filter 50ms ease-out, color 30ms ease-out;
        :hover:enabled {
            filter: brightness(120%);
        }

        :active:enabled {
            filter: brightness(80%);
        }
        :disabled {
            color: #666;
        }

        :disabled {
            cursor: not-allowed;
        }
    }
`;
