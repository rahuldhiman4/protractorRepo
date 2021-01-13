describe("This is for report testing 1", () => {
    beforeAll(async () => {
        console.log("Test before All");
    });

    afterAll(async () => {
        console.log("Test after All");
    });

    //fail
    it('[3810,3811,3812,3813]: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
        expect('Fail this').toBe('Qiao Feng');
    });

    //fail
    describe('[3870,3871]: UI fields should be visible for user with login ID contains @ sign', async () => {
        beforeAll(async () => {
            console.log("I am in beforeAll");
        });

        it('[3870,3871]: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
            expect('Pass this').toBe('Pass this');
        });

        it('[3870,3871]: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
            expect('Fail this').toBe('Qiao Feng');
        });

        afterAll(async () => {
            console.log("I am in After All");
        });
    });

    it('[5804, 5577]: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
        expect('Pass this').toBe('Pass this');
    });

    describe('[5555]: UI fields should be visible for user with login ID contains @ sign', async () => {
        beforeAll(async () => {
            console.log("I am in beforeAll");
        });

        it('[5555]: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
            expect('Pass this').toBe('Pass this');
        });

        it('[5555]: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
            expect('Pass this').toBe('Pass this');
        });

        afterAll(async () => {
            console.log("I am in After All");
        });
    });

    describe('[5600,5888]: UI fields should be visible for user with login ID contains @ sign', async () => {
        beforeAll(async () => {
            console.log("I am in beforeAll");
        });

        it('[5600,5888]: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
            expect('Pass this').toBe('Pass this');
        });

        afterAll(async () => {
            console.log("I am in After All");
        });
    });

    xit('[6111, 6222]: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
        expect('Pass this').toBe('Pass this');
    });
});