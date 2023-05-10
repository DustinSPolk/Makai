USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Select_ByUsers]    Script Date: 5/10/2023 12:00:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Dustin Polk
-- Create date: 03-29-2023
-- Description: Select Messages Between Specific Users
-- Code Reviewer: Osein Solkin

-- MODIFIED BY: 
-- MODIFIED DATE: 
-- Code Reviewer:
-- Note:
-- =============================================

ALTER proc [dbo].[Messages_Select_ByUsers]
	      @FirstUserId int
	      ,@SecondUserId int

as

/* --- TEST ---

	DECLARE @FirstUserId int = 8
			    ,@SecondUserId int = 576

	EXECUTE [dbo].[Messages_Select_ByUsers]
		      @FirstUserId
		      ,@SecondUserId


*/

BEGIN

	SELECT m.Id
		  ,m.Message
		  ,m.Subject
		  ,m.RecipientId
			,ur.FirstName
			,ur.LastName
			,ur.Mi
			,ur.AvatarUrl
		  ,m.SenderId
			,us.FirstName
			,us.LastName
			,us.Mi
			,us.AvatarUrl
		  ,m.DateSent
		  ,m.DateRead
		  ,m.DateModified
		  ,m.DateCreated

	FROM [dbo].[Messages] AS m
	INNER JOIN [dbo].[Users] as ur
	  ON m.RecipientId = ur.Id
	INNER JOIN [dbo].[Users] as us
	  ON m.SenderId = us.Id  

	WHERE   (@FirstUserId = m.RecipientId AND @SecondUserId = m.SenderId)
		      OR (@SecondUserId = m.RecipientId AND @FirstUserId = m.SenderId)

	ORDER BY DateCreated

END
