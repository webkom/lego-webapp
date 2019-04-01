import Poll from '../.';

const props = {
    poll: {
        option: undefined
    }
};

function createPollTest(inputs, outputs) {
    let pollOptions = {input: [], output: []};
    for (let i = 0; i < inputs.length; i++) {
        pollOptions.input.push({ratio: inputs[i]});
        pollOptions.output.push({ratio: outputs[i]});
    }
    return pollOptions
}

const poll = new Poll(props);
const pollOptions = [
    createPollTest([33.33, 33.33, 33.33], [34, 33, 33]),
    createPollTest([13.626332, 47.989636, 9.596008, 28.788024], [48, 29, 14, 9]),
    createPollTest([16.666, 16.666, 16.666, 16.666, 16.666, 16.666], [17, 17, 17, 17, 16, 16]),
    createPollTest([33.333, 33.333, 33.333], [34, 33, 33]),
    createPollTest([33.3, 33.3, 33.3, 0.1], [34, 33, 33, 0])
];

describe('poll options', () => {
    it('should add up to 100%', () => {
        pollOptions.forEach(({input, output}) => {
            expect(poll.perfectRatios(input, input)).toEqual(output);
        });
    });
});