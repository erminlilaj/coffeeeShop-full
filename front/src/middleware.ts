// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import type { MiddlewareHandler } from 'astro';

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);
  const token = context.cookies.get('coffee_shop_token')?.value;

  // Allow access to login page
  if (url.pathname === '/login') {
    if (token) {
      return context.redirect('/');
    }
    return next();
  }

  // Protect all other routes
  if (!token) {
    return context.redirect('/login');
  }

  // Continue to the requested page if authenticated
  return next();
});