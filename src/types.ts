/*
types.ts
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

Specifies various types. Must be similar to `structs.rs`.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/

export type Config = {
    color: string;
    color_asked: boolean;
};

export type Message = {
    id: string;
    content: string;
    timestamp: number;
    author: "self" | "other" | "system";
    bookmarked: 0 | 1;
};
