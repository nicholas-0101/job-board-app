"use client";

import { useState } from "react";

export function useCompanyDetailCard() {
  const [openShare, setOpenShare] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [isEligibleToReview, setIsEligibleToReview] = useState(false);
  const [userEmployment, setUserEmployment] = useState<any>(null);

  const handleEligibilityCheck = (isEligible: boolean, employment?: any) => {
    setIsEligibleToReview(isEligible);
    setUserEmployment(employment);
  };

  const handleReviewClick = () => {
    if (isEligibleToReview) {
      setOpenReview(true);
    }
  };

  const handleShareClick = () => {
    setOpenShare(true);
  };

  const closeShare = () => {
    setOpenShare(false);
  };

  const closeReview = () => {
    setOpenReview(false);
  };

  return {
    openShare,
    openReview,
    isEligibleToReview,
    userEmployment,
    handleEligibilityCheck,
    handleReviewClick,
    handleShareClick,
    closeShare,
    closeReview,
  };
}
