const randomItemFromPlayerInventory = (state) => {
  const wares = state.player.wares();
  if (wares.length) {
    return wares[rndInt(wares.length)];
  }
};

const conditionsAndEvents = [
  [ // Strange package
    state => state.player.credits > 0,
    state => {
      const ware = randomItemFromPlayerInventory(state);
      const qty = 3 + rndInt(3);

      showEventPanel(state,
        [
          'You see a big package bobbing',
          `in the water. What might it be?`
        ],
        [[
          `Poke it with an oar`,
          () => {
            if (rndFloat() > 0.5) {
              showAlertPanel(state, [
                `Just some junk.`,
                `Oh well.`,
              ]);
            } else if (rndFloat() > 0.5) {
              showAlertPanel(state, [
                `A pirate jumps out of the package and`,
                `scales the side of your ship. He manages`,
                `to steal some money before leaving.`,
              ]);
              state.player.credits -= rndInt(Math.floor(state.player.credits / 2));
            } else {
              showAlertPanel(state, [
                `It cloinks like metal. You drag it`,
                `on board. It's a small stash of `,
                `weapons! Finders keepers!`,
              ]);
              state.player.inventory['Weapons'] = state.player.inventory['Weapons'] || 0;
              state.player.inventory['Weapons'] += qty;
            }
          },
        ],
        [
          `Leave it alone`,
          () => {
            showAlertPanel(state, ['You sail on.', `Some stones are best left unturned.`]);
          },
        ]]
      );
    }
  ],
  [ // Pirates
    state => randomItemFromPlayerInventory(state),
    state => {
      const ware = randomItemFromPlayerInventory(state);
      const qty = 2 + rndInt(10);

      showEventPanel(state,
        ['A shady ship pulls up.', `"Give us your ${ware}!`, `If not, bad things happen!"`],
        [[
          `Give your ${ware}`,
          () => {
            showAlertPanel(state, [`The ship sails off.`, `You can hear the crew laughing.`]);
            state.player.inventory[ware] = 0;
          },
        ],
        [
          `Refuse`,
          () => {
            if (rndFloat() > 0.5) {
              showAlertPanel(state, ['You refuse, and break away.', `The pirates cannot keep up.`]);
            } else {
              showAlertPanel(state, [
                'You try to refuse.',
                'The pirates enter your ship.',
                'They take the ${ware},',
                'and half your money.'
              ]);

              state.player.credits = Math.ceil(state.player.credits / 2);
              state.player.inventory[ware] = 0;
            }
          },
        ]]
      );
    }
  ],
  [ // Cotton trader
    state => randomItemFromPlayerInventory(state),
    state => {
      const ware = randomItemFromPlayerInventory(state);
      const qty = 2 + rndInt(10);

      showEventPanel(state,
        ['A fellow trader stops you.', `"I\'m in dire need of ${ware}.`, `I\'ll trade you my cotton for one!"`],
        [[
          '"Sure"',
          () => {
            showAlertPanel(state, [`The sailor gives you ${qty} Cotton.`]);
            state.player.inventory[ware] -= 1;
            state.player.inventory['Cotton'] = state.player.inventory['Cotton'] || 0;
            state.player.inventory['Cotton'] += qty;
          },
        ],
        [
          '"I don\'t think so"',
          () => {
            showAlertPanel(state, ['The sailor leaves, still longing', `for some ${ware.toLowerCase()}.`]);
          },
        ]]
      );
    }
  ],
];

const triggerEvent = (state) => {
  let i = 0;
  while (true && (i++ < 10)) {
    for (let [condition, triggerEvent] of conditionsAndEvents) {
      if ((rndOne() > 0.8) && condition(state)) {
        triggerEvent(state);
        return;
      }
    }
  }
};