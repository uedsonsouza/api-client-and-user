import CustomersController from "../../src/app/controllers/CustomersController.js"
import Customer from "../../src/app/models/Customer.js"

jest.mock("../../src/app/models/Customer.js")

describe("Customer controller for route index", () => {
    it("deve retornar todos os clientes cadastrados com sucesso", async () => {
        const mockData = [
            {
                id: '1',
                name: 'uedson',
                email: 'teste@gmail.com',
                status: 'ARCHIVED'
            }
        ]
        Customer.findAll.mockResolvedValue(mockData)

        const req = {
            params: { customer_id: '2' },
            query: {
                name: "uedson",
                email: "teste@gmail.com",
                status: "ARCHIVED",
                createdBefore: "2001-12-12",
                createdAfter: "2002-12-12",
                updatedBefore: "2003-12-12",
                updatedAfter: "2004-12-12",
                sort: "name:asc"
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

         await CustomersController.index(req,res)

         expect(Customer.findAll).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    customer_id: '2'
                }),
                limit: 25,
                offset: 0
            })
        )

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockData)
    })

    it("deve retornar erro caso nao consiga retonar os usuarios cadastrados", async () => {
        Customer.index = jest.fn().mockRejectedValue(new Error("BD error"))

        const req = {
            params: { customer_id: '2'},
            body: {
                name: 'uedson',
                email: 'teste@gmail.com',
                status: 'ACTIVE'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await CustomersController.index(req,res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ error: "Error search Customer" })
    })
})

describe("contact Controller for route show", () => {
    it("deve retornar o usuario cadastrado por id com sucesso", async () => {
        const mockContact = {
            id: '1',
            name: 'uedson',
            email: 'teste@gmail.com',
            status: 'ACTIVE'
        };

        Customer.findOne.mockResolvedValue(mockContact)

        const req = {
            params: { id: '1', customer_id:'2'}
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await CustomersController.show(req,res)

        expect(Customer.findOne).toHaveBeenCalledWith({
            where: { id: '1', customer_id:'2' },
            attributes: { exclude: ["customer_id", "customerId"] }
        })

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockContact)
    })
    it("deve retornar erro quando tentar buscar usuario cadastrado por id", async () => {
        Customer.findOne.mockResolvedValue(null)

        const req = {
            params: { id: '1', customer_id:'2'}
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await CustomersController.show(req,res)

        expect(Customer.findOne).toHaveBeenCalledWith({
            where: { id: '1', customer_id:'2' },
            attributes: { exclude: ["customer_id", "customerId"] }
        })

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ error: "Contact not found" })
    })
})

describe("Contact controller for route create", () => {
    it("deve retornar 201 quando usuario for cadastrado com sucesso", async () => {
        const mockContact = {
            id: '1',
            name: 'uedson',
            email: 'teste@gmail.com',
            status: 'ACTIVE'
        };

        Customer.create = jest.fn().mockResolvedValue(mockContact)

        const req = {
            params: { customer_id: '2'},
            body: {
                name: 'uedson',
                email: 'teste@gmail.com',
                status: 'ACTIVE'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await CustomersController.create(req,res)

        expect(Customer.create).toHaveBeenCalledWith({
            customer_id: '2',
            name: 'uedson',
            email: 'teste@gmail.com',
            status: 'ACTIVE'
        })

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(mockContact)
    })
    it("deve retornar 400 quando dados de cadastro do usuario forem inválidos", async () => {
        Customer.create = jest.fn()

        const req = {
            params: { customer_id: '2'},
            body: {
                name: '',
                email: 'teste@gmail.com',
                status: 'ACTIVE'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await CustomersController.create(req,res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid contact data" })
        expect(Customer.create).not.toHaveBeenCalledWith()
    })
    it("deve retornar 500 quando houver erro na criacao do contato", async () => {
        Customer.create = jest.fn().mockRejectedValue(new Error("BD error"))

        const req = {
            params: { customer_id: '2'},
            body: {
                name: 'uedson',
                email: 'teste@gmail.com',
                status: 'ACTIVE',
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await CustomersController.create(req,res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ error: "Error creating contact" })
    })
})

describe("Contact controller for route update", () => {
    it("deve retornar 200 para atualizacao dos dados de contato com sucesso", async () => {
        const mockContact = {
            id: '1',
            name: 'uedson',
            email: 'teste@gmail.com',
            status: 'ACTIVE',
            update: jest.fn().mockResolvedValue(true)
        };

        Customer.findOne = jest.fn().mockResolvedValue(mockContact)

        const req = {
            params: { id: '1', customer_id:'2' },
            body: {
                name: 'pedro',
                email: 'teste@gmail.com',
                status: 'ARCHIVE'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await CustomersController.update(req,res)

        expect(Customer.findOne).toHaveBeenCalledWith({
            where: { id: '1', customer_id:'2' },
            attributes: { exclude: ["customer_id", "customerId"] }
        })

        expect(mockContact.update).toHaveBeenCalledWith({
            name: 'pedro',
            email: 'teste@gmail.com',
            status: 'ARCHIVE'
        })

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockContact)
    })
    it("deve retornar erro 404 quando quando encontrar o contato para atulização", async () => {
        Customer.findOne.mockResolvedValue(null)

        const req = {
            params: { id: '1', customer_id:'2'}
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await CustomersController.update(req,res)

        expect(Customer.findOne).toHaveBeenCalledWith({
            where: { id: '1', customer_id:'2' },
            attributes: { exclude: ["customer_id", "customerId"] }
        })

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ error: "Contact not found" })
    })
    it("deve retornar 500 quando houver erro na atulizacao do contato", async () => {
        const mockContact = {
            id: '1',
            name: 'uedson',
            email: 'teste@gmail.com',
            status: 'ACTIVE',
            update: jest.fn().mockRejectedValue(new Error("DB error"))
        };

        Customer.findOne = jest.fn().mockResolvedValue(mockContact)

        const req = {
            params: { id: '1', customer_id:'2' },
            body: {
                name: 'pedro',
                email: 'teste@gmail.com',
                status: 'ARCHIVE'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await CustomersController.update(req,res)

        expect(Customer.findOne).toHaveBeenCalledWith({
            where: { id: '1', customer_id:'2' },
            attributes: { exclude: ["customer_id", "customerId"] }
        })

        expect(mockContact.update).toHaveBeenCalledWith({
            name: 'pedro',
            email: 'teste@gmail.com',
            status: 'ARCHIVE'
        })

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ error: "Error updating contact" })
    })

    it("deve retornar erro 400 quando dado de contato por inválido", async () => {
        const req = {
            params: { id: '1', customer_id:'2' },
            body: {
                name: [],
                email: 'teste@gmail.com',
                status: 'ARCHIVE'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await CustomersController.update(req,res)


        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid contact data" })
    })
})

describe("Contact controller for route destroy", () => {
    it("deve validar o caso onde o usuario é deletado com sucesso", async () => {
            const mockContact = {
            id: '1',
            name: 'uedson',
            email: 'teste@gmail.com',
            status: 'ACTIVE',
            destroy: jest.fn().mockResolvedValue(true)
        };

        Customer.findOne = jest.fn().mockResolvedValue(mockContact)

        const req = {
            params: { id: '1', customer_id:'2' },
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await CustomersController.destroy(req,res)

        expect(Customer.findOne).toHaveBeenCalledWith({
            where: { id: '1', customer_id:'2' }
        })

        expect(mockContact.destroy).toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith()
    })

    it("deve retorna 404 quando o usuario a ser deletado nao for encontrado", async () => {
        Customer.findOne.mockResolvedValue(null)

        const req = {
            params: { id: '1', customer_id:'2'}
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await CustomersController.destroy(req,res)

        expect(Customer.findOne).toHaveBeenCalledWith({
            where: { id: '1', customer_id:'2' }
        })

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ error: "Contact not found" })
    })
})