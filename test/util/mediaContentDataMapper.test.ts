import { extractEpisodeMetadata } from '../../src/util/media-content-data-mapper';
import assert from 'assert';
// ...existing code...

describe('extractEpisodeMetadata', () => {
  it('should extract episode metadata correctly for verbose naming: Season xx Episode xx', () => {
    const input = 'Example Series Season 1 Episode 01';
    const expectedOutput = 'Season 1 Episode 01';
    const result = extractEpisodeMetadata(input);
    assert.equal(result, expectedOutput);
  });

  it('should extract episode metadata correctly for short naming: Sxx.EPxx', () => {
    const input = 'Example Series S01.EP01';
    const expectedOutput = 'S01.EP01';
    const result = extractEpisodeMetadata(input);
    assert.equal(result, expectedOutput);
  });
  it('should extract episode metadata correctly for short naming: Sxx Exx', () => {
    const input = 'Example Series S01 E01';
    const expectedOutput = 'S01 E01';
    const result = extractEpisodeMetadata(input);
    assert.equal(result, expectedOutput);
  });
});

// describe('extractCoreMetadata', () => {
//   it('should extract core metadata correctly', () => {
//     const input = {
//       // ...sample input data...
//     };
//     const expectedOutput = {
//       // ...expected output data...
//     };
//     const result = extractCoreMetadata(input);
//     expect(result).toEqual(expectedOutput);
//   });

//   it('should handle missing core metadata gracefully', () => {
//     const input = {
//       // ...sample input data with missing core metadata...
//     };
//     const expectedOutput = {
//       // ...expected output data...
//     };
//     const result = extractCoreMetadata(input);
//     expect(result).toEqual(expectedOutput);
//   });
// });
