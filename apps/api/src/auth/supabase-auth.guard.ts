import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { supabaseAdmin } from '@arctube/supabase';

/**
 * Guard that validates Supabase JWT tokens from the Authorization header.
 * Injects the authenticated user into the request context.
 *
 * Usage: @UseGuards(SupabaseAuthGuard) on controller or route
 */
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.replace('Bearer ', '');

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Attach user to request for downstream handlers
    request.user = user;
    return true;
  }
}
