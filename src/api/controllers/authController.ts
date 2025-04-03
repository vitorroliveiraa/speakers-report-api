import { IAuthService } from "types/IAuthService.ts";
import { Request, Response } from "express";
import {
  changePasswordSchema,
  requestUserSchema,
  resetPasswordSchema,
} from "validators/userValidator.ts";
import { authControllerLogger as logger } from "utils.ts/logger.ts";

export class AuthController {
  constructor(private authService: IAuthService) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    logger.info({ email }, "Tentativa de login");

    const result = await this.authService.login({ email, password });
    logger.info({ email, userId: result.user.id }, "Login bem-sucedido");

    res.status(200).json(result);
  }

  async changePassword(req: Request, res: Response) {
    const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);
    const { id: userId } = requestUserSchema.parse(req.user);

    logger.info({ userId }, "Solicitação para mudança de senha recebida");

    await this.authService.changePassword({
      oldPassword,
      newPassword,
      userId,
    });
    logger.info({ userId }, "Mudança de senha bem-sucedida");

    res.status(200).json({ message: "Password updated successfully" });
  }

  async forgotPassword(req: Request, res: Response) {
    const { memberNumber } = req.body;
    logger.info(
      { memberNumber },
      "Solicitação de recuperação de senha recebida"
    );

    await this.authService.forgotPassword(memberNumber);
    logger.info({ memberNumber }, "E-mail de recuperação enviado");

    res
      .status(200)
      .json({ message: "Verifique seu e-mail para redefinir sua senha." });
  }

  async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);
    logger.info({ token }, "Solicitação de redefinição de senha recebida");

    await this.authService.resetPassword(token, newPassword);
    logger.info({ token }, "Senha redefinida com sucesso");

    res.status(200).json({ message: "Senha redefinida com sucesso." }).send();
  }
}
