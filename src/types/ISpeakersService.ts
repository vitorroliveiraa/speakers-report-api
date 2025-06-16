export type MemberType = "internal" | "external";

export interface Speakers {
  id: string;
  type: MemberType;
  speaker_position: number;
}

export type ListSpeakers = {
  name: string;
  last_speech_date: string;
  speaker_position: number;
  sundays_since_last_speech: string;
};

export type ChurchMembers = {
  id: string;
  name: string;
  type: string;
  ward_id: number;
};

interface IBaseSpeaker {
  sacrament_meeting_date: string;
  ward_id: number;
  speaker_position: number;
}

export interface IInternalSpeakerData extends IBaseSpeaker {
  member_id: string;
  external_member_id?: never;
}
export interface IExternalSpeakerData extends IBaseSpeaker {
  external_member_id: string;
  member_id?: string;
}

export type SpeakerData = IInternalSpeakerData | IExternalSpeakerData;

export interface ISpeakersService {
  create(
    sacrament_meeting_date: string,
    ward_id: number,
    speakers: Speakers[]
  ): Promise<void>;
  listAllSpeakers(wardId: number): Promise<ListSpeakers[]>;
  listChurchMembers(wardId: number): Promise<ChurchMembers[]>;
}
