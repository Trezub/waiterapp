import { createTRPCReact } from '@trpc/react-query';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../../../api';
import * as Device from 'expo-device';

export const trpc = createTRPCReact<AppRouter>();

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export const apiEndpoint = Device.isDevice
    ? 'http://192.168.1.100:3333'
    : 'http://10.0.2.2:3333';
