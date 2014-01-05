/*global describe, it, expect, dotBox */

var global = Function('return this')();

describe("dotBox.views.Color", function () {

    var Color = dotBox.views.Color;

    describe("constructor", function () {

        it("should create a solid white color if no arguments supplied", function () {

            var target,
                act;

            act = function () {
                target = new Color();
            };

            expect(act).not.toThrow();

            expect(target).not.toBeNull();

            expect(target.red).toBe(255);
            expect(target.blue).toBe(255);
            expect(target.green).toBe(255);
            expect(target.alpha).toBe(1);


        });

        it("should be constructable without new operator", function () {

            var target;


            target = Color();

            expect(target).not.toBeNull();
            expect(target instanceof Color);


            expect(global.red).toBeUndefined();
            expect(global.blue).toBeUndefined();
            expect(global.green).toBeUndefined();
            expect(global.alpha).toBeUndefined();


        });

        it("should be constructable without new operator and with color arguments", function () {

            var target;


            target = Color(10, 20, 30, 0.56);

            expect(target).not.toBeNull();
            expect(target instanceof Color);


            expect(global.red).toBeUndefined();
            expect(global.blue).toBeUndefined();
            expect(global.green).toBeUndefined();
            expect(global.alpha).toBeUndefined();

            expect(target.red).toBe(10);
            expect(target.green).toBe(20);
            expect(target.blue).toBe(30);
            expect(target.alpha).toBe(0.56);


        });

        it("should be constructable without new operator and with color arguments", function () {

            var target;


            target = Color('#0a141e');

            expect(target).not.toBeNull();
            expect(target instanceof Color);


            expect(global.red).toBeUndefined();
            expect(global.blue).toBeUndefined();
            expect(global.green).toBeUndefined();
            expect(global.alpha).toBeUndefined();

            expect(target.red).toBe(10);
            expect(target.green).toBe(20);
            expect(target.blue).toBe(30);
            expect(target.alpha).toBe(1);


        });

        it("should be constructable with a lower case hex html color code", function () {

            var target,
                act;

            act = function () {

                target = new Color('#0a141e');

            };

            expect(act).not.toThrow();

            expect(target.red).toBe(10);
            expect(target.green).toBe(20);
            expect(target.blue).toBe(30);
            expect(target.alpha).toBe(1);




        });

        it("should be constructable with an upper case hex html color code", function () {

            var target,
                act;

            act = function () {

                target = new Color('#0A141E');

            };

            expect(act).not.toThrow();

            expect(target.red).toBe(10);
            expect(target.green).toBe(20);
            expect(target.blue).toBe(30);
            expect(target.alpha).toBe(1);




        });

        describe("should be constructable with rgba() color string", function () {

            it("that has no spaces", function () {

                var target,
                    act;

                act = function () {

                    target = new Color('rgba(10,20,30,.56)');

                };

                expect(act).not.toThrow();

                expect(target.red).toBe(10);
                expect(target.green).toBe(20);
                expect(target.blue).toBe(30);
                expect(target.alpha).toBe(0.56);


            });

            it("that has leading or trailing spaces", function () {

                var target,
                    act;

                act = function () {

                    target = new Color('  rgba(10,20,30,.56)  ');

                };

                expect(act).not.toThrow();

                expect(target.red).toBe(10);
                expect(target.green).toBe(20);
                expect(target.blue).toBe(30);
                expect(target.alpha).toBe(0.56);


            });

            it("that has inner spaces", function () {

                var target,
                    act;

                act = function () {

                    target = new Color('rgba( 10, 20 , 30, .56 )');

                };

                expect(act).not.toThrow();

                expect(target.red).toBe(10);
                expect(target.green).toBe(20);
                expect(target.blue).toBe(30);
                expect(target.alpha).toBe(0.56);


            });

            it("should throw if args have more than four components", function () {

                var target,
                    act;

                act = function () {

                    target = new Color('rgba(10,20,30,.25, 3)');

                };

                expect(act).toThrow();


            });

            it("should throw if args have less than four components", function () {

                var target,
                    act;

                act = function () {

                    target = new Color('rgba(10,20,30)');

                };

                expect(act).toThrow();


            });


        });


        describe("should be constructable with rgb() color string", function () {

            it("that has no spaces", function () {

                var target,
                    act;

                act = function () {

                    target = new Color('rgb(10,20,30)');

                };

                expect(act).not.toThrow();

                expect(target.red).toBe(10);
                expect(target.green).toBe(20);
                expect(target.blue).toBe(30);
                expect(target.alpha).toBe(1);


            });

            it("that has leading or trailing spaces", function () {

                var target,
                    act;

                act = function () {

                    target = new Color('  rgb(10,20,30)  ');

                };

                expect(act).not.toThrow();

                expect(target.red).toBe(10);
                expect(target.green).toBe(20);
                expect(target.blue).toBe(30);
                expect(target.alpha).toBe(1);


            });

            it("that has inner spaces", function () {

                var target,
                    act;

                act = function () {

                    target = new Color('rgb( 10, 20 , 30 )');

                };

                expect(act).not.toThrow();

                expect(target.red).toBe(10);
                expect(target.green).toBe(20);
                expect(target.blue).toBe(30);
                expect(target.alpha).toBe(1);


            });

            it("should throw if args have more than three components", function () {

                var target,
                    act;

                act = function () {

                    target = new Color('rgb(10,20,30,13)');

                };

                expect(act).toThrow();


            });

            it("should throw if args have less than three components", function () {

                var target,
                    act;

                act = function () {

                    target = new Color('rgb(10,20)');

                };

                expect(act).toThrow();


            });


        });

        describe("should be constructable with four args", function () {


            it("that have three ints and one float", function () {

                var target,
                    act;

                act = function () {
                    target = new Color(10, 20, 30, 0.56);
                };

                expect(act).not.toThrow();
                expect(target.red).toBe(10);
                expect(target.green).toBe(20);
                expect(target.blue).toBe(30);
                expect(target.alpha).toBe(0.56);


            });

            it("that have four floats", function () {

                var target,
                    act;

                act = function () {
                    target = new Color(10.1, 20.5, 30.6, 0.56);
                };

                expect(act).not.toThrow();
                expect(target.red).toBe(10);
                expect(target.green).toBe(21);
                expect(target.blue).toBe(31);
                expect(target.alpha).toBe(0.56);


            });

            it("that have four strings", function () {

                var target,
                    act;

                act = function () {
                    target = new Color("10.1", "20.5", "30.6", "0.56");
                };

                expect(act).not.toThrow();
                expect(target.red).toBe(10);
                expect(target.green).toBe(21);
                expect(target.blue).toBe(31);
                expect(target.alpha).toBe(0.56);


            });

        });

        describe("should be constructable with three args", function () {


            it("that have three ints", function () {

                var target,
                    act;

                act = function () {
                    target = new Color(10, 20, 30);
                };

                expect(act).not.toThrow();
                expect(target.red).toBe(10);
                expect(target.green).toBe(20);
                expect(target.blue).toBe(30);
                expect(target.alpha).toBe(1);


            });

            it("that have three floats", function () {

                var target,
                    act;

                act = function () {
                    target = new Color(10.1, 20.5, 30.6);
                };

                expect(act).not.toThrow();
                expect(target.red).toBe(10);
                expect(target.green).toBe(21);
                expect(target.blue).toBe(31);
                expect(target.alpha).toBe(1);


            });

            it("that have three strings", function () {

                var target,
                    act;

                act = function () {
                    target = new Color("10.1", "20.5", "30.6");
                };

                expect(act).not.toThrow();
                expect(target.red).toBe(10);
                expect(target.green).toBe(21);
                expect(target.blue).toBe(31);
                expect(target.alpha).toBe(1);


            });

        });


    });

    describe("toString", function () {

        it("should return rgba formatted string", function () {

            var target,
                actual;

            target = new Color();
            target.red = 10;
            target.green = 20;
            target.blue = 30;

            target.alpha = 0.5;

            actual = target.toString();

            expect(actual).toBe('rgba(10,20,30,0.5)');


        });

        it("should round color values", function () {

            var target,
                actual;

            target = new Color();
            target.red = 10.1;
            target.green = 20.6;
            target.blue = 30.5;

            target.alpha = 0.56;

            actual = target.toString();

            expect(actual).toBe('rgba(10,21,31,0.56)');

        });

    });


    it("clone should clone all colors and be a different instance", function () {

        var target,
            clone,
            R = 10,
            G = 20,
            B = 30,
            A = 0.56;

        target = new Color();
        target.red = R;
        target.green = G;
        target.blue  = B;
        target.alpha = A;

        clone = target.clone();

        expect(clone).not.toBe(target);
        expect(clone.red).toBe(R);
        expect(clone.green).toBe(G);
        expect(clone.blue).toBe(B);
        expect(clone.alpha).toBe(A);


    });

});