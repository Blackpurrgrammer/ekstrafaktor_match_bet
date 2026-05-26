import { dedupeInjuriesByPlayerId } from './myFunctions';

test('dedupeInjuriesByPlayerId removes duplicate players from the same fixture', () => {
  const injuries = [
    { fixture: { id: 101 }, player: { id: 1 }, team: { id: 10 } },
    { fixture: { id: 101 }, player: { id: 1 }, team: { id: 10 } },
    { fixture: { id: 101 }, player: { id: 2 }, team: { id: 10 } },
    { fixture: { id: 102 }, player: { id: 1 }, team: { id: 10 } },
  ];

  expect(dedupeInjuriesByPlayerId(injuries)).toEqual([
    { fixture: { id: 101 }, player: { id: 1 }, team: { id: 10 } },
    { fixture: { id: 101 }, player: { id: 2 }, team: { id: 10 } },
    { fixture: { id: 102 }, player: { id: 1 }, team: { id: 10 } },
  ]);
});
