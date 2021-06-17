import { User } from "../../entities/User";
import { IMailProvider } from "../../providers/IMailProvider";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ICreateUserRequestDTO } from "./CreateUserDTO";

export class CreateUserUseCase {

    // private usersRepository: IUsersRepository;

    constructor(
        private usersRepository: IUsersRepository, //atalho para fazer a mesma coisa que os comentários
        private mailProvider: IMailProvider
    ) {
        // this.usersRepository = usersRepository;
    }
    
    async execute(data: ICreateUserRequestDTO){
        const userAlreadyExists = await this.usersRepository.findByEmail(data.email);

        if(userAlreadyExists){
            throw new Error('User already exists.');
        }

        const user = new User(data);

        await this.usersRepository.save(user);

        await this.mailProvider.sendMail({
            to: {
                name: data.name,
                email: data.email,
            },
            from: {
                name: 'Equipe do meu app',
                email: 'equipe@meuapp.com',
            },
            subject: 'Seja Bem vindo',
            body: '<p>Você já pode fazer login em nossa plataforma</p>'
        })
    };
}