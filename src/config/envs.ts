import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars{
    PORT: number;
    DATABASE_URL: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required()
})
.unknown(true);

const {error, value} = envsSchema.validate(process.env);

if(error){
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    databaseUrl: envVars.DATABASE_URL
}





// Dotenv obsoleto, Node ya lo trae por defecto en process.loadEnvFile()

// import * as joi from 'joi';

// process.loadEnvFile();

// interface EnvVars{
//     PORT: number;
// }

// const envsSchema = joi.object({
//     PORT: joi.number().required()
// })
// .unknown(true);

// const {error, value} = envsSchema.validate(process.env);

// if(error){
//     throw new Error(`Config validation error: ${error.message}`);
// }

// const envVars: EnvVars = value;

// export const envs = {
//     port: envVars.PORT
// }