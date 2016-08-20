(function (angular) {
    'use strict';

    var controls,
        enemies;

    controls = [
        {
            slug: "A",
            name: "Attack",
            effects: {
                assailant: {
                    health: -2
                },
                self: {
                    stamina: -3
                }
            }
        },
        {
            slug: "B",
            name: "Block",
            effects: {
                assailant: {},
                self: {
                    stamina: -2
                }
            }
        },
        {
            slug: "R",
            name: "Rest",
            effects: {
                assailant: {},
                self: {
                    stamina: 3
                }
            }
        },
        {
            slug: "H",
            name: "Heal",
            effects: {
                assailant: {},
                self: {
                    stamina: 2,
                    health: 3
                }
            }
        }
    ];
    enemies = [
        {
            name: "Undead Warrior",
            combos: [
                [{
                    slug: "A",
                    name: "Attack",
                    effects: {
                        assailant: {
                            health: -5
                        },
                        self: {
                            stamina: -2
                        }
                    }
                },
                {
                    slug: "B",
                    name: "Block",
                    effects: {
                        assailant: {},
                        self: {
                            stamina: -3
                        }
                    }
                },
                {
                    slug: "R",
                    name: "Rest",
                    effects: {
                        assailant: {},
                        self: {
                            stamina: 2
                        }
                    }
                },
                {
                    slug: "R",
                    name: "Rest",
                    effects: {
                        assailant: {},
                        self: {
                            stamina: 2
                        }
                    }
                }],
                [{
                    slug: "R",
                    name: "Rest",
                    effects: {
                        assailant: {},
                        self: {
                            stamina: 2
                        }
                    }
                },
                {
                    slug: "B",
                    name: "Block",
                    effects: {
                        assailant: {},
                        self: {
                            stamina: -3
                        }
                    }
                },
                {
                    slug: "A",
                    name: "Attack",
                    effects: {
                        assailant: {
                            health: -5
                        },
                        self: {
                            stamina: -2
                        }
                    }
                },
                {
                    slug: "B",
                    name: "Block",
                    effects: {
                        assailant: {},
                        self: {
                            stamina: -3
                        }
                    }
                }],
                [{
                    slug: "A",
                    name: "Attack",
                    effects: {
                        assailant: {
                            health: -5
                        },
                        self: {
                            stamina: -2
                        }
                    }
                },
                {
                    slug: "A",
                    name: "Attack",
                    effects: {
                        assailant: {
                            health: -5
                        },
                        self: {
                            stamina: -2
                        }
                    }
                },
                {
                    slug: "B",
                    name: "Block",
                    effects: {
                        assailant: {},
                        self: {
                            stamina: -3
                        }
                    }
                },
                {
                    slug: "R",
                    name: "Rest",
                    effects: {
                        assailant: {},
                        self: {
                            stamina: 2
                        }
                    }
                }]
            ]
        }
    ];

    function stBattle() {
        return {
            restrict: 'E',
            scope: true,
            bindToController: {},
            controller: 'BattleController as battleCtrl',
            templateUrl: '/src/components/battle.html'
        };
    }

    function BattleController($timeout) {
        var vm;
        vm = this;
        vm.enemy = {
            health: 5,
            name: "Undead Warrior",
            stamina: 5
        };
        vm.player = {
            combo: {
                actions: [],
                stamina: 5
            },
            health: 20,
            name: "Blasko",
            stamina: 5,
            controls: controls
        };

        vm.addAction = function (action) {
            vm.player.combo.stamina += action.effects.self.stamina;
            vm.enemy.combo.health += action.effects.assailant.health;
            if (vm.player.combo.stamina < 0) {
                vm.player.combo.stamina = 0;
            } else {
                vm.player.combo.actions.push(JSON.parse(JSON.stringify(action)));
            }
        };

        vm.genArray = function (number) {
            return new Array(number);
        };

        vm.undo = function () {
            var action;
            action = vm.player.combo.actions.splice(vm.player.combo.actions.length - 1, 1);
            vm.player.combo.stamina -= action[0].effects.self.stamina;
            vm.enemy.combo.health -= action[0].effects.assailant.health;
        };

        vm.battle = function () {
            var index,
                performAction;

            index = 0;
            performAction = function () {

                var enemyAction,
                    playerAction;

                enemyAction = vm.enemy.combo.actions[index];
                playerAction = vm.player.combo.actions[index];

                // Do enemy action.
                switch (enemyAction.slug) {
                    case "A":
                    if (playerAction.slug !== "B") {
                        vm.player.health += enemyAction.effects.assailant.health;
                    }
                    break;
                }

                vm.enemy.stamina += enemyAction.effects.self.stamina;

                // Then do player action.
                switch (playerAction.slug) {
                    case "A":
                    if (enemyAction.slug !== "B") {
                        vm.enemy.health += playerAction.effects.assailant.health;
                    }
                    break;
                }
                vm.player.stamina += playerAction.effects.self.stamina;

                enemyAction.isComplete = true;
                playerAction.isComplete = true;

                if (++index !== vm.enemy.combo.actions.length) {
                    $timeout(performAction, 800);
                } else {
                    vm.player.combo = {
                        actions: [],
                        health: vm.player.health,
                        stamina: vm.player.stamina
                    };
                    updateEnemyCombo();
                }
            };

            $timeout(performAction, 800);
        };

        function updateEnemyCombo() {
            var randIndex;
            randIndex = Math.floor(Math.random() * enemies[0].combos.length);
            vm.enemy.combo = {
                actions: JSON.parse(JSON.stringify(enemies[0].combos[randIndex])),
                health: vm.enemy.health || 0,
                stamina: vm.enemy.stamina || 0
            };
            if (vm.enemy.combo.health <= 0) {
                alert("You win!");
            }
            vm.enemy.combo.actions.forEach(function (action) {
                vm.enemy.combo.stamina += action.effects.self.stamina;
            });
        }

        updateEnemyCombo();
    }

    BattleController.$inject = [
        '$timeout'
    ];


    angular.module('battle', [])
        .controller('BattleController', BattleController)
        .directive('stBattle', stBattle);

}(window.angular));
