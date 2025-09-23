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

        await CustomersController.index(req, res)

        expect(Customer.findAll).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockData)
    })

    it("deve retornar erro caso ocorra exceção no findAll", async () => {
        Customer.findAll.mockRejectedValue(new Error("BD error"))

        const req = {
            params: { customer_id: '2' },
            query: {}
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await CustomersController.index(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" })
    })

    it("deve retornar clientes filtrados por nome", async () => {
        const mockData = [{ id: '2', name: 'pedro', email: 'pedro@gmail.com', status: 'ACTIVE' }]
        Customer.findAll.mockResolvedValue(mockData)

        const req = {
            query: { name: "pedro" },
            params: {}
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await CustomersController.index(req, res)

        expect(Customer.findAll).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({
                name: expect.any(Object)
            })
        }))
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockData)
    })
})

describe("Customer controller for route show", () => {
    it("deve retornar o cliente cadastrado por id com sucesso", async () => {
        const mockCustomer = {
            id: '1',
            name: 'uedson',
            email: 'teste@gmail.com',
            status: 'ACTIVE'
        };

        Customer.findByPk.mockResolvedValue(mockCustomer)

        const req = { params: { id: '1' } }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

        await CustomersController.show(req, res)

        expect(Customer.findByPk).toHaveBeenCalledWith('1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockCustomer)
    })

    it("deve retornar erro 404 quando cliente não encontrado", async () => {
        Customer.findByPk.mockResolvedValue(null)

        const req = { params: { id: '99' } }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

        await CustomersController.show(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ error: "Customer not found" })
    })
})

describe("Customer controller for route create", () => {
    it("deve retornar 201 quando cliente for cadastrado com sucesso", async () => {
        const mockCustomer = {
            id: '1',
            name: 'uedson',
            email: 'teste@gmail.com',
            status: 'ACTIVE'
        };

        Customer.create.mockResolvedValue(mockCustomer)

        const req = {
            body: {
                name: 'uedson',
                email: 'teste@gmail.com',
                status: 'ACTIVE'
            }
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

        await CustomersController.create(req, res)

        expect(Customer.create).toHaveBeenCalledWith(req.body)
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(mockCustomer)
    })

    it("deve retornar 400 quando dados de cadastro do cliente forem inválidos", async () => {
        Customer.create.mockResolvedValue({})

        const req = {
            body: {
                name: '',
                email: 'invalid-email',
                status: 'ACTIVE'
            }
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

        await CustomersController.create(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid customer data" })
        expect(Customer.create).not.toHaveBeenCalled()
    })

    it("deve retornar 500 quando houver erro na criação do cliente", async () => {
        Customer.create.mockRejectedValue(new Error("DB error"))

        const req = {
            body: {
                name: 'uedson',
                email: 'teste@gmail.com',
                status: 'ACTIVE'
            }
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

        jest.spyOn(require("yup"), "object").mockReturnValue({
            shape: () => ({
                isValid: async () => true
            })
        })

        await CustomersController.create(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" })
    })
})

describe("Customer controller for route update", () => {
    it("deve retornar 200 para atualização dos dados do cliente com sucesso", async () => {
        const mockCustomer = {
            id: '1',
            name: 'uedson',
            email: 'teste@gmail.com',
            status: 'ACTIVE',
            update: jest.fn().mockResolvedValue(true)
        };

        Customer.findByPk.mockResolvedValue(mockCustomer)

        const req = {
            params: { id: '1' },
            body: {
                name: 'pedro',
                email: 'pedro@gmail.com',
                status: 'ARCHIVED'
            }
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

        await CustomersController.update(req, res)

        expect(Customer.findByPk).toHaveBeenCalledWith('1')
        expect(mockCustomer.update).toHaveBeenCalledWith(req.body)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockCustomer)
    })

    it("deve retornar erro 404 quando cliente para atualização não encontrado", async () => {
        Customer.findByPk.mockResolvedValue(null)

        const req = { params: { id: '99' }, body: { name: 'pedro', email: 'pedro@gmail.com', status: 'ARCHIVED' } }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

        await CustomersController.update(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ error: "Customer not found" })
    })

    it("deve retornar erro 400 quando dados de atualização forem inválidos", async () => {
    jest.spyOn(require("yup"), "object").mockReturnValue({
        shape: () => ({
            isValid: async () => false
        })
    })

    const req = {
        params: { id: '1' },
        body: {
            name: '',
            email: 'invalid-email',
            status: 'ARCHIVED'
        }
    }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    await CustomersController.update(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid customer data" })
    expect(Customer.findByPk).not.toHaveBeenCalled()
})

    it("deve retornar erro 500 quando houver erro na atualização do cliente", async () => {
        jest.spyOn(require("yup"), "object").mockReturnValue({
            shape: () => ({
                isValid: async () => true
            })
        })

        const mockCustomer = {
            id: '1',
            name: 'pedro',
            email: 'pedro@gmail.com',
            status: 'ARCHIVED',
            update: jest.fn().mockRejectedValue(new Error("DB error"))
        };

        Customer.findByPk.mockResolvedValue(mockCustomer)

        const req = {
            params: { id: '1' },
            body: {
                name: 'pedro',
                email: 'pedro@gmail.com',
                status: 'ARCHIVED'
            }
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

        await CustomersController.update(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" })
})
})

describe("Customer controller for route destroy", () => {
    it("deve deletar cliente com sucesso", async () => {
        const mockCustomer = {
            id: '1',
            name: 'uedson',
            email: 'teste@gmail.com',
            status: 'ACTIVE',
            destroy: jest.fn().mockResolvedValue(true)
        };

        Customer.findByPk.mockResolvedValue(mockCustomer)

        const req = { params: { id: '1' } }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

        await CustomersController.destroy(req, res)

        expect(Customer.findByPk).toHaveBeenCalledWith('1')
        expect(mockCustomer.destroy).toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith()
    })

    it("deve retornar erro 404 quando cliente para deletar não encontrado", async () => {
        Customer.findByPk.mockResolvedValue(null)

        const req = { params: { id: '99' } }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

        await CustomersController.destroy(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ error: "Customer not found" })
    })
})
