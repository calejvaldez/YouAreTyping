/*
tools.ts
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

Some stuff that may be useful for other components.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/

const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export function determine_author(
    author: "self" | "other",
    switched: boolean,
): "self" | "other" {
    if (switched) {
        if (author === "self") {
            return "other";
        } else if (author === "other") {
            return "self";
        }
    }

    return author;
}

export function get_readable_timestamp(
    timestamp: number,
    format: "date" | "time",
): string {
    let d = new Date(timestamp * 1000);

    if (format === "date") {
        return `${MONTHS[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`;
    } else {
        let hour_24 = d.getHours();
        let hour_12 = hour_24 > 11 ? hour_24 - 12 : hour_24;
        hour_12 = hour_12 === 0 ? 12 : hour_12;
        let minute_padded =
            d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
        let am_pm = hour_24 > 11 ? "pm" : "am";
        return `${hour_12}:${minute_padded} ${am_pm}`;
    }
}
