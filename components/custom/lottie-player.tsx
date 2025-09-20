'use client';
import {
  DotLottieReact,
  DotLottieReactProps,
} from '@lottiefiles/dotlottie-react';
import { FC } from 'react';

export const LottiePlayer: FC<DotLottieReactProps> = (props) => {
  return <DotLottieReact {...props} />;
};
