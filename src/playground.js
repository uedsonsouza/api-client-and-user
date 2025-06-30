import "./database";
import Customer from "./app/models/Customer";

// documentacao para se guiar ->  https://sequelize.org/docs/v7/querying/operators/
class Playground {
    static async play() {
        const customers = await Customer.create({
            name: "Tiazinho do bazar",
            email: "tiaozim@teste.com",
        })

        // const customers2 = await Customer.findByPk(12)
        // console.log("Sou eu antes --->", JSON.stringify(customers2, null, 2))

        // customers2.destroy()
        // const customer3 = await customers2.update(
        //     { name: "João Silva Atualizado", status: "ACTIVE" },
        // )
        // console.log("Sou eu depois --->", JSON.stringify(customer3, null, 2))
        console.log(JSON.stringify(customers, null, 2));
        // console.log(JSON.stringify(customers2, null, 2));
        // console.log(JSON.stringify(contacts, null, 2));
    }
}
Playground.play()
    .then(() => console.log("Playground executed successfully"))
    .catch((err) => console.error("Error executing playground:", err));
