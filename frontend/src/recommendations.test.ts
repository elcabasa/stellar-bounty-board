import { describe, expect, it } from "vitest";

import { generateRecommendations, scoreMatch, type ContributorProfile } from "./recommendations";
import type { Bounty } from "./types";

function createBounty(overrides: Partial<Bounty> = {}): Bounty {
    return {
        id: "bounty-1",
        repo: "example-org/example-repo",
        issueNumber: 1,
        title: "Example bounty",
        summary: "Example summary",
        maintainer: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        tokenSymbol: "XLM",
        amount: 100,
        status: "open",
        createdAt: 1_700_000_000,
        deadlineAt: 1_700_086_400,
        version: 1,
        events: [],
        labels: [],
        ...overrides,
    };
}

function createProfile(overrides: Partial<ContributorProfile> = {}): ContributorProfile {
    return {
        completedLabels: [],
        preferredRepos: [],
        averageRewardRange: {
            min: 0,
            max: 1_000,
        },
        ...overrides,
    };
}

describe("scoreMatch", () => {
    it("returns 0 when no user skills are provided", () => {
        const bounty = createBounty({
            labels: [{ name: "bug", color: "f29513" }],
        });

        expect(scoreMatch(bounty, [])).toBe(0);
    });

    it("returns 0 when no bounty tags are provided", () => {
        const bounty = createBounty();

        expect(scoreMatch(bounty, ["bug"])).toBe(0);
    });

    it("returns 1 for a full overlap", () => {
        const bounty = createBounty({
            labels: [
                { name: "bug", color: "f29513" },
                { name: "typescript", color: "3178c6" },
            ],
        });

        expect(scoreMatch(bounty, ["bug", "typescript"])).toBe(1);
    });
});

describe("generateRecommendations", () => {
    it("uses scoreMatch as a tiebreaker when recommendation scores are equal", () => {
        const higherOverlap = createBounty({
            id: "bounty-a",
            repo: "example-org/no-extra-signals",
            amount: 10,
            labels: [{ name: "bug", color: "f29513" }],
        });

        const lowerOverlap = createBounty({
            id: "bounty-b",
            repo: "example-org/extra-signals",
            amount: 10,
            labels: [{ name: "documentation", color: "0075ca" }],
        });

        const profile = createProfile({
            completedLabels: ["bug"],
            preferredRepos: ["example-org/extra-signals"],
            averageRewardRange: {
                min: 10,
                max: 10,
            },
        });

        const recommendations = generateRecommendations([lowerOverlap, higherOverlap], profile, 2);

        expect(recommendations.map((recommendation) => recommendation.bounty.id)).toEqual([
            "bounty-a",
            "bounty-b",
        ]);
    });
});