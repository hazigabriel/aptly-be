export default () => ({
    app: {
        frontEndUrl: process.env.FRONTEND_URL,
    },
    aws: {
        region: process.env.AWS_S3_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        bucketName: process.env.AWS_BUCKET_NAME,
    },
    database: {
        url: process.env.DATABASE_URL,
        postgresUser: process.env.POSTGRES_USER,
        postgresPass: process.env.POSTGRES_PASSWORD,
        postgresDb: process.env.POSTGRES_DB,
    },
    email: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    secret: {
        access: process.env.AT_SECRET,
        refresh: process.env.RT_SECRET,
        email: process.env.ET_SECRET,
        resetPassword: process.env.RP_SECRET,
    },
    llm: {
        openAIApiKey: process.env.OPENAI_API_KEY,
        openAIParseTextPrompt: process.env.OPENAI_PARSE_TEXT_PROMPT,
    },
})
