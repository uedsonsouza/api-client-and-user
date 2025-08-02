import Mail from "../../lib/Mail.js";
class WelcomeEmailJob {
    get key() {
        return 'WelcomeEmailJob';
    }

    async handle({ data }) {
        const { email, name } = data;

         Mail.send({
                    to: email,
                    subject: "Welcome to the system",
                    text: `Hello ${name}, welcome to our system!`,
                    html: `<p>Hello <strong>${name}</strong>, welcome to our system!</p>`,
                });
    }
}

export default new WelcomeEmailJob();