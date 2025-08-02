class DummyJob {
    get key() {
        return 'DummyJob';
    }

    async handle({ data}) {
        const { message } = data;
        console.log(`Processing DummyJob with message: ${message}`);
    }
}

export default new DummyJob();