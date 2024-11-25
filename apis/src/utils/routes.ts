import { AuthModule, UserModule, CategoryModule, ProductModule, OrderModule, CommentModule } from '@modules';
import { Routes } from '@nestjs/core';

export const routes: Routes = [
  {
    path: 'api/v1',
    children: [
      { path: '/users', module: UserModule },
      { path: '/auth', module: AuthModule },
      { path: '/category', module: CategoryModule },
      { path: '/product', module: ProductModule },
      { path: '/order', module: OrderModule },
      { path: '/comment', module: CommentModule },
    ],
  },
];
