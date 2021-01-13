fdescribe("Case Self Approval Tests", () => {
    beforeAll(async () => {
        console.log("Test before All");
    });

    afterAll(async () => {
        console.log("Test after All");
    });

    //fail
    it('[12116, 12115]: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
        expect('Fail this').toBe('Qiao Feng');
    });

    //fail
    describe('[12114, 12113]: UI fields should be visible for user with login ID contains @ sign', async () => {
        beforeAll(async () => {
            console.log("I am in beforeAll");
        });

        it('[12114, 12113]: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
            expect('Pass this').toBe('Pass this');
        });

        it('[12114, 12113]: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
            expect('Fail this').toBe('Qiao Feng');
        });

        afterAll(async () => {
            console.log("I am in After All");
        });
    });

    it('[12112, 12111]: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
        expect('Pass this').toBe('Pass this');
    });

    describe('[12110]: UI fields should be visible for user with login ID contains @ sign', async () => {
        beforeAll(async () => {
            console.log("I am in beforeAll");
        });

        it('[12110]: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
            expect('Pass this').toBe('Pass this');
        });

        it('[12110]: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
            expect('Pass this').toBe('Pass this');
        });

        afterAll(async () => {
            console.log("I am in After All");
        });
    });

    describe('[12109,12108]: UI fields should be visible for user with login ID contains @ sign', async () => {
        beforeAll(async () => {
            console.log("I am in beforeAll");
        });

        it('[12109,12108]: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
            expect('Pass this').toBe('Pass this');
        });

        afterAll(async () => {
            console.log("I am in After All");
        });
    });

    xit('[12107,12106]: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
        expect('Pass this').toBe('Pass this');
    });
});