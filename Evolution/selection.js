class Selection {

    static select(fitnessValues) {
        const sorted = [...fitnessValues].sort(
            (a, b) => b.fitness - a.fitness
        );

        return [
            sorted[0].parasite,
            sorted[1].parasite
        ];
    }
}

export default Selection;