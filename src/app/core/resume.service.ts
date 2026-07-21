import { Injectable } from '@angular/core';
import {
  PROFILE, LINKS, SUMMARY, STATS, ROLES, PROJECTS, SKILLS,
  EDUCATION, CERTS, ARCH_NODES, ARCH_EDGES,
} from '../data/resume';

/**
 * Injectable access point for résumé content. Components depend on this
 * abstraction rather than importing the data module directly, which keeps
 * them decoupled from where the data lives and easy to test with a stub.
 */
@Injectable({ providedIn: 'root' })
export class ResumeService {
  readonly profile = PROFILE;
  readonly links = LINKS;
  readonly summary = SUMMARY;
  readonly stats = STATS;
  readonly roles = ROLES;
  readonly projects = PROJECTS;
  readonly skills = SKILLS;
  readonly education = EDUCATION;
  readonly certs = CERTS;
  readonly archNodes = ARCH_NODES;
  readonly archEdges = ARCH_EDGES;
}
