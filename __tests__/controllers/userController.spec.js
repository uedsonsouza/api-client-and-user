import ContactsController from "../../src/app/controllers/ContactsController.js"
import Contacts from "../../src/app/models/Contacts.js"

jest.mock("../../src/app/models/Contacts.js")

describe("Contact controller for route index", () => {
    it("deve retornar todos os usuários cadastrados com sucesso", async () => {
        const mockData = [
            {
                id: '1',
                name: 'uedson',
                email: 'teste@gmail.com',
                status: 'ARCHIVED'
            }
        ]
        Contacts.findAll.mockResolvedValue(mockData)

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

         await ContactsController.index(req,res)

         expect(Contacts.findAll).toHaveBeenCalledWith(
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
        Contacts.index = jest.fn().mockRejectedValue(new Error("BD error"))

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

        await ContactsController.index(req,res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ error: "Error search contacts" })
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

        Contacts.findOne.mockResolvedValue(mockContact)

        const req = {
            params: { id: '1', customer_id:'2'}
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await ContactsController.show(req,res)

        expect(Contacts.findOne).toHaveBeenCalledWith({
            where: { id: '1', customer_id:'2' },
            attributes: { exclude: ["customer_id", "customerId"] }
        })

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockContact)
    })
    it("deve retornar erro quando tentar buscar usuario cadastrado por id", async () => {
        Contacts.findOne.mockResolvedValue(null)

        const req = {
            params: { id: '1', customer_id:'2'}
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await ContactsController.show(req,res)

        expect(Contacts.findOne).toHaveBeenCalledWith({
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

        Contacts.create = jest.fn().mockResolvedValue(mockContact)

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

        await ContactsController.create(req,res)

        expect(Contacts.create).toHaveBeenCalledWith({
            customer_id: '2',
            name: 'uedson',
            email: 'teste@gmail.com',
            status: 'ACTIVE'
        })

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(mockContact)
    })
    it("deve retornar 400 quando dados de cadastro do usuario forem inválidos", async () => {
        Contacts.create = jest.fn()

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

        await ContactsController.create(req,res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid contact data" })
        expect(Contacts.create).not.toHaveBeenCalledWith()
    })
    it("deve retornar 500 quando houver erro na criacao do contato", async () => {
        Contacts.create = jest.fn().mockRejectedValue(new Error("BD error"))

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

        await ContactsController.create(req,res)

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

        Contacts.findOne = jest.fn().mockResolvedValue(mockContact)

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

        await ContactsController.update(req,res)

        expect(Contacts.findOne).toHaveBeenCalledWith({
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
        Contacts.findOne.mockResolvedValue(null)

        const req = {
            params: { id: '1', customer_id:'2'}
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await ContactsController.update(req,res)

        expect(Contacts.findOne).toHaveBeenCalledWith({
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

        Contacts.findOne = jest.fn().mockResolvedValue(mockContact)

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

        await ContactsController.update(req,res)

        expect(Contacts.findOne).toHaveBeenCalledWith({
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

        await ContactsController.update(req,res)


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

        Contacts.findOne = jest.fn().mockResolvedValue(mockContact)

        const req = {
            params: { id: '1', customer_id:'2' },
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await ContactsController.destroy(req,res)

        expect(Contacts.findOne).toHaveBeenCalledWith({
            where: { id: '1', customer_id:'2' }
        })

        expect(mockContact.destroy).toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith()
    })

    it("deve retorna 404 quando o usuario a ser deletado nao for encontrado", async () => {
        Contacts.findOne.mockResolvedValue(null)

        const req = {
            params: { id: '1', customer_id:'2'}
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await ContactsController.destroy(req,res)

        expect(Contacts.findOne).toHaveBeenCalledWith({
            where: { id: '1', customer_id:'2' }
        })

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ error: "Contact not found" })
    })
})